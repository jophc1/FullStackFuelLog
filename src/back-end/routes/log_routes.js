import { Router } from 'express'
import LogModel from '../models/Log.js'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'
import mongoose from 'mongoose'

const router = Router()

router.use(authAccess)

router.get('/', verifyAdmin, async (req, res) => {
  // access the query params
  const pageOptions = {
    page: parseInt(req.query.page, 10) || 0,
    limit: parseInt(req.query.limit, 10) || 10,
    sort: { date: -1 },
    populate: [{ path: 'vehicle_id', select: 'asset_id'}, { path: 'user_id', select: 'name username_id -_id'}]
  }
  /* querying for `all` {} items in `LogModel`, paginating by pageOptions.page, pageOptions.limit items per page */
  let logPagination = await LogModel.paginate({}, pageOptions, function(error, result) {
    if (error) {
      throw error
    } else {
      return result
    }
  })
  logPagination ? res.send(logPagination) : res.status(404).send({ error: 'Logs not found' })
})
// the log id will be the mongoDB generated _id
router.get('/:id', verifyAdmin, async (req, res) => {
  try {
    const logs = await LogModel.findById(req.params.id)
    logs ? res.send(logs) : res.status(404).send({ error: 'Log not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    // get
    const vehicleID = new mongoose.Types.ObjectId(req.body.vehicle_id)
    let lastLog = await LogModel.find({ vehicle_id: vehicleID }).sort({ current_odo: -1 })

    // if no log entry exists
    if (lastLog.length == 0) {
      lastLog.push({
        current_odo: 0
      })
    }

    if (req.body.current_odo > lastLog[0].current_odo) {
      const newLog = await LogModel.create({ ...req.body, user_id: req.jwtIdentity.id })
      res.send(newLog)
    } else {
      throw new Error(`Current ODO must be greater than ${lastLog[0].current_odo}`)
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})
// the log id will be the mongoDB generated _id
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const deletedLog = await LogModel.findByIdAndDelete(req.params.id)
    deletedLog ? res.sendStatus(200) : res.status(404).send({ error: 'Log not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(errorAuth)

export default router
