import { Router } from 'express'
import LogModel from '../models/Log.js'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'
import mongoose from 'mongoose'

const router = Router()

router.use(authAccess)

router.get('/', verifyAdmin, async (req, res) => {
  res.send(await LogModel.find())
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
    const lastLog = await LogModel.find({ vehicle_id: vehicleID }).sort({ current_odo: -1 })
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
