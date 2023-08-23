import LogModel from "../models/Log.js"
import { Router } from "express"
import VehicleModel from "../models/Vehicle.js"
import mongoose from "mongoose"
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

const router = Router()

router.use(authAccess)


// employee dashboard table report
router.get('/employee/current/month', async (req, res) => {
  try {
    // create date objects for current date at time of query and date for start of month
    const current_date = new Date()
    const current_month = current_date.getMonth() + 1
    const current_year = current_date.getFullYear()
    const employeeID = new mongoose.Types.ObjectId(req.jwtIdentity.id)

    const monthlyReportEmployee = await LogModel.aggregate([
      { $match: { user_id: employeeID } }, 
      { $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' }},
        vehicles: { $addToSet: '$vehicle_id' },
        fuelTotal: { $sum: '$fuel_added' },
        totalFuelLogs: { $count: {} }
      }},
      { $addFields: {
        vehicleCount: { $size: '$vehicles' }
      }},
      { $unset: ['vehicles'] },
      { $project: {
        _id: 0,
        month: '$_id.month',
        year: '$_id.year',
        fuelTotal: 1,
        totalFuelLogs: 1,
        vehicleCount: 1
      }},
      { $sort: { month: -1, year: -1 } }
    ]) 
    
    if(monthlyReportEmployee.length > 0 && monthlyReportEmployee[0].month == current_month && monthlyReportEmployee[0].year == current_year) {
      res.send(monthlyReportEmployee[0])
    } else {
      res.send({ 
        fuelTotal: 0,
        totalFuelLogs: 0,
        vehicleCount: 0
      })
    }

  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(verifyAdmin)

// employer dashboard table report
router.get('/:start_date_year/:start_date_month/:start_date_day/to/:end_date_year/:end_date_month/:end_date_day', async (req, res) => {
  try {
    // create date objects for the start and end dates
    const start_date = new Date(`${req.params.start_date_year}-${req.params.start_date_month}-${req.params.start_date_day}`)
    const end_date = new Date(`${req.params.end_date_year}-${req.params.end_date_month}-${req.params.end_date_day}`)
    // filter out logs based on the date periods
    const reportAggregate = await LogModel.aggregate([
      { $match: { date: { $lte: end_date, $gte: start_date } } },
      { $group: { 
          _id: { 'vehicle': '$vehicle_id' },
          totalFuel: { $sum: '$fuel_added' },
          odoMin: { $min: '$current_odo' },
          odoMax: { $max: '$current_odo' },
          totalLogsRecorded: { $sum: 1 },
        },
      },
      {
        $addFields: {
          totalDistance: { $subtract: [ '$odoMax', '$odoMin' ] }
        }
      },
      // hide fields
      { $unset: [ "odoMin", "odoMax"] },
      // populate a vehicle field using the _id.vehicle from the group _id
      { "$lookup": {
          "from": VehicleModel.collection.name,
          "localField": "_id.vehicle",
          "foreignField": "_id",
          "as": "vehicle"
        }
      },
    ])
    res.send(reportAggregate)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// employer dashboard line graph
router.get('/graph/:vehicle_id/line/distance/', async (req, res) => {
  try {
    const idToSearch = new mongoose.Types.ObjectId(req.params.vehicle_id)
    const graphAggregate = await LogModel.aggregate([
      { $match: { vehicle_id: idToSearch } },
    ])
    const distanceTravelledPerFill = {}
    for (let i = 0; i < graphAggregate.length; i++) {
      if (i < graphAggregate.length - 1) {
        distanceTravelledPerFill[`point ${i + 1}`] = {distance: (graphAggregate[i + 1].current_odo - graphAggregate[i].current_odo), fuelAdded: graphAggregate[i + 1].fuel_added}
      }
    }
    res.send({
      distanceTravelledPerFill
    })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// employer dashboard pie graph
router.get('/graph/pie/vehicles/usage/all/time', async (req, res) => {
  try {
    const vehicles = await LogModel.aggregate([
      // Stage 1: no grouping
      { $group: {
          _id: null,
          companyTotalUsage: { $sum: '$fuel_added' },
          usage:  {  $push:  { vehicle: '$vehicle_id' ,  totalUsageForVehicle: { $sum: '$fuel_added' }, } }
        }
      },
      // Stage 2: unpack array elements
      { "$unwind": "$usage" },
      // Stage 3: group by vehicle key from element items
      { $group: {
          _id:  { 'usage': '$usage.vehicle' },
          vehicleID: { $first: '$usage.vehicle' },
          totalUsageforVehicle:  { $sum: '$usage.totalUsageForVehicle' },
          companyTotalUsage: { $first: '$companyTotalUsage' }
        }
      },
      // Stage 4: remove grouping id
      {
        $project: {
          _id: 0,
          vehicle: '$usage.vehicle',
          vehicleID: '$vehicleID',
          totalUsageforVehicle: '$totalUsageforVehicle',
          companyTotalUsage: '$companyTotalUsage',
        }
      },
      // populate object keys
      { "$lookup": {
          "from": VehicleModel.collection.name,
          "localField": "vehicleID",
          "foreignField": "_id",
          "as": "vehicleID"
        }
      },
    ])
    // Calulate percentage for each vehicle and add to vehicle objects
    vehicles.forEach(vehicle => {
      vehicle.percentage = Number(((vehicle.totalUsageforVehicle / vehicle.companyTotalUsage) * 100).toFixed(2))
    })
    res.send({
      vehicles
    })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// employer dashboard bar graph
router.get('/graph/bar/vehicles/usage/past/6/months', async (req, res) => {
  try {
    const vehicles = await LogModel.aggregate([
      { $group: {
          _id:{ month: { $month: '$date' } },
          totalMonthlyUsage: { $sum: '$fuel_added' },
          usage:  {  $push:  { vehicle: '$vehicle_id' ,  current_odo: { $sum: '$current_odo' }, month: { $month: '$date' } } }
        }
      },
      // Stage 2: unpack array elements
      { "$unwind": "$usage" },
      // Stage 3: group by vehicle key from element items
      { $group: {
          _id:  { 'vehicle': '$usage.vehicle', 'month': '$usage.month'  },
          vehicleID: { $first: '$usage.vehicle' },
          current_odo:  { $addToSet: '$usage.current_odo' },
          totalMonthlyUsage: { $first: '$totalMonthlyUsage' }
        }
      },
        // populate object keys
      { "$lookup": {
          "from": VehicleModel.collection.name,
          "localField": "vehicleID",
          "foreignField": "_id",
          "as": "vehicleID"
        }
      },
    ])
    // gather and sort data based on months, data saved in vehicles is sorted by vehicle id and months
    // response object will have month keys and the values of each month will be an object with keys totalMonthlyUsage and distanceTravelledPerFill
    const respObjec = {}
    // months are identified by numbers i.e. June is 6, July is 7 etc.
    // go through each collection add the totalMonthlyUsage field for each month
    vehicles.forEach(vehicle => {
      respObjec[vehicle._id.month] = { totalMonthlyUsage: vehicle.totalMonthlyUsage, distanceTravelledPerFill: 0 }
      // sort current_odo for each vehicle 
      const sortedOdo = vehicle.current_odo.sort(function(a, b){return a - b})
      // calculate distance travelled between fill for each vehicle during each month and add to the total of distanceTravelledPerFill 
      for (let i = 0; i < sortedOdo.length; i++) {
        if (i < sortedOdo.length - 1) {
          respObjec[vehicle._id.month].distanceTravelledPerFill += sortedOdo[i + 1]- sortedOdo[i]
        }
      }
    })
    res.send(respObjec)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(errorAuth)

export default router
