import { Router } from "express"
import LogReviewModel from "../models/LogReview.js"

const router = Router()

router.get('/', async (req, res) => {
  res.send(await LogReviewModel.find())
})

router.get('/:id', async (req, res) => {
  try {
    const review = await LogReviewModel.findById(req.params.id)
    review ? res.send(review) : res.status(404).send({ error: 'Review not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const review = await LogReviewModel.create(req.body)
    res.status(201).send(review)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedReview = await LogReviewModel.findByIdAndDelete(req.params.id)
    deletedReview ? res.sendStatus(200) : res.status(400).send({ error: 'Review not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router
