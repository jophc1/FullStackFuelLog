import LogModel from "../models/Log.js"
import { Router } from "express"
import VehicleModel from "../models/Vehicle.js"
import mongoose from "mongoose"
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

const router = Router()

router.use(authAccess)
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
      // populate a vehicle field using the _id.vehicle
      { "$lookup": {
          "from": VehicleModel.collection.name,
          "localField": "_id.vehicle",
          "foreignField": "_id",
          "as": "vehicle"
        }
      },
    ])
    console.log(await LogModel.find({ date: { $lte: end_date, $gte: start_date } }))
    res.send(reportAggregate)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// employer dashboard graph
router.get('/graph/:vehicle_id/distance/', async (req, res) => {
  const idToSearch = new mongoose.Types.ObjectId(req.params.vehicle_id)
  const graphAggregate = await LogModel.aggregate([
    { $match: { vehicle_id: idToSearch } },
  ])
  const distanceTravelledPerFill = []
  for (let i = 0; i < graphAggregate.length; i++) {
    if (i < graphAggregate.length - 1) {
      distanceTravelledPerFill.push(graphAggregate[i + 1].current_odo - graphAggregate[i].current_odo)
    }
  }
  res.send({
    distanceTravelledPerFill,
    graphAggregate
  })
})

router.use(errorAuth)

export default router
