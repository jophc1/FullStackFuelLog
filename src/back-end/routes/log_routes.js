import { Router } from "express"
import LogModel from "../models/Log.js"
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

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
    const newLog = await LogModel.create(req.body)
    res.send(newLog)
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
