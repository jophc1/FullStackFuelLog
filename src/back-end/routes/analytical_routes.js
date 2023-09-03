import LogModel from '../models/Log.js'
import { Router } from 'express'
import VehicleModel from '../models/Vehicle.js'
import mongoose from 'mongoose'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

const router = Router()

router.use(authAccess)

// employee dashboard table report
router.get('/employee/current/month', async (req, res) => {
  try {
    // create date objects for current date at time of query and date for start of month
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()
    const employeeID = new mongoose.Types.ObjectId(req.jwtIdentity.id)

    const monthlyReportEmployee = await LogModel.aggregate([
      { $match: { user_id: employeeID } },
      {
        $group: {
          _id: { month: { $month: '$date' }, year: { $year: '$date' } },
          vehicles: { $addToSet: '$vehicle_id' },
          fuelTotal: { $sum: '$fuel_added' },
          totalFuelLogs: { $count: {} }
        }
      },
      {
        $addFields: {
          vehicleCount: { $size: '$vehicles' }
        }
      },
      { $unset: ['vehicles'] },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          fuelTotal: 1,
          totalFuelLogs: 1,
          vehicleCount: 1
        }
      },
      { $sort: { month: -1, year: -1 } }
    ])

    if (monthlyReportEmployee.length > 0 && monthlyReportEmployee[0].month === currentMonth && monthlyReportEmployee[0].year === currentYear) {
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
router.get('/:startDateYear/:startDateMonth/:startDateDay/to/:endDateYear/:endDateMonth/:endDateDay', async (req, res) => {
  try {
    // create date objects for the start and end dates
    const startDate = new Date(`${req.params.startDateYear}-${req.params.startDateMonth}-${req.params.startDateDay}`)
    const endDate = new Date(`${req.params.endDateYear}-${req.params.endDateMonth}-${req.params.endDateDay}`)
    // filter out logs based on the date periods
    const reportAggregate = await LogModel.aggregate([
      { $match: { date: { $lte: endDate, $gte: startDate } } },
      {
        $group: {
          _id: { vehicle: '$vehicle_id' },
          totalFuel: { $sum: '$fuel_added' },
          odoMin: { $min: '$current_odo' },
          odoMax: { $max: '$current_odo' },
          totalLogsRecorded: { $sum: 1 }
        }
      },
      {
        $addFields: {
          totalDistance: { $subtract: ['$odoMax', '$odoMin'] }
        }
      },
      // hide fields
      { $unset: ['odoMin', 'odoMax'] },
      // populate a vehicle field using the _id.vehicle from the group _id
      {
        $lookup: {
          from: VehicleModel.collection.name,
          localField: '_id.vehicle',
          foreignField: '_id',
          as: 'vehicle'
        }
      }
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
      { $match: { vehicle_id: idToSearch } }
    ])
    const distanceTravelledPerFill = []
    for (let i = 0; i < graphAggregate.length; i++) {
      if (i < graphAggregate.length - 1) {
        distanceTravelledPerFill.push({ distance: (graphAggregate[i + 1].current_odo - graphAggregate[i].current_odo), fuelAdded: graphAggregate[i + 1].fuel_added })
      }
    }
    res.send(
      distanceTravelledPerFill
    )
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// employer dashboard pie graph
router.get('/graph/pie/vehicles/usage/all/time', async (req, res) => {
  try {
    const vehicles = await LogModel.aggregate([
      // Stage 1: no grouping
      {
        $group: {
          _id: null,
          companyTotalUsage: { $sum: '$fuel_added' },
          usage: { $push: { vehicle: '$vehicle_id', totalUsageForVehicle: { $sum: '$fuel_added' } } }
        }
      },
      // Stage 2: unpack array elements
      { $unwind: '$usage' },
      // Stage 3: group by vehicle key from element items
      {
        $group: {
          _id: { usage: '$usage.vehicle' },
          vehicleID: { $first: '$usage.vehicle' },
          totalUsageforVehicle: { $sum: '$usage.totalUsageForVehicle' },
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
          companyTotalUsage: '$companyTotalUsage'
        }
      },
      // populate object keys
      {
        $lookup: {
          from: VehicleModel.collection.name,
          localField: 'vehicleID',
          foreignField: '_id',
          as: 'vehicleID'
        }
      }
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
      {
        $group: {
          _id: { vehicle: '$vehicle_id', month: { $month: '$date' } },
          totalMonthlyUsage: { $sum: '$fuel_added' },
          odoMin: { $min: '$current_odo' },
          odoMax: { $max: '$current_odo' }
        }
      },
      {
        $addFields: {
          totalDistance: { $subtract: ['$odoMax', '$odoMin'] }
        }
      },
      {
        $project: {
          _id: { month: '$_id.month' },
          vehicle: '$_id.vehicle',
          month: '$_id.month',
          totalMonthlyUsage: '$totalMonthlyUsage',
          totalMonthlyDistance: '$totalDistance',
          odoMax: '$odoMax'
        }
      }
    ])

    const objArrOne = Array.from(vehicles.reduce(
      (m, { month, totalMonthlyUsage }) => m.set(month, (m.get(month) || 0) + totalMonthlyUsage), new Map()
    ), ([month, totalMonthlyUsage]) => ({ month, totalMonthlyUsage }))

    const objArrTwo = Array.from(vehicles.reduce(
      (m, { month, totalMonthlyDistance }) => m.set(month, (m.get(month) || 0) + totalMonthlyDistance), new Map()
    ), ([month, totalMonthlyDistance]) => ({ month, totalMonthlyDistance }))

    const respObj = []

    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    objArrOne.map((report, index) => {
      if (report.month === objArrTwo[index].month) {
        respObj.push({ ...report, ...objArrTwo[index], monthName: month[report.month - 1] })
      }
    })

    res.send(respObj)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(errorAuth)

export default router
