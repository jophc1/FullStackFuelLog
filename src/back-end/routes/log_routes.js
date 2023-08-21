import { Router } from "express"
import LogModel from "../models/Log.js"

const router = Router()

router.get('/', async (req, res) => {
  res.send(await LogModel.find())
})

router.get('/:id', async (req, res) => {
  try {
    const logs = await LogModel.findById(req.params.id)
    logs ? res.send(logs) : res.status(404).send({ error: 'Log not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const newLog =  await LogModel.create(req.body)
    res.send(newLog)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedLog = await LogModel.findByIdAndDelete(req.params.id)
    deletedLog ? res.sendStatus(200) : res.status(404).send({ error: 'Log not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router
