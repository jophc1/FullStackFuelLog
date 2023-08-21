import LogModel from "../models/Log.js"
import { Router } from "express"

const router = Router()

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
          totalLogsRecorded: { $sum: 1 }
        },
      },
    ])
    res.send(reportAggregate)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router
