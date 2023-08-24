import { Router } from 'express'
import LogReviewModel from '../models/LogReview.js'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'
import mongoose from 'mongoose'

const router = Router()

router.use(authAccess)

router.post('/', async (req, res) => {
  try {
    const employeeId = new mongoose.Types.ObjectId(req.jwtIdentity.id)
    const reviewBody = {...req.body, employee_id: employeeId} 
    const review = await LogReviewModel.create(reviewBody)
    res.status(201).send(review)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(verifyAdmin)

router.get('/', async (req, res) => {
  const allLogReviews = await LogReviewModel.find()
  allLogReviews ? res.send(allLogReviews) : res.status(200).send({ LogReviews: 'No log reviews found' })
})

router.get('/:id', async (req, res) => {
  try {
    const review = await LogReviewModel.findById(req.params.id)
    review ? res.send(review) : res.status(404).send({ error: 'Review not found' })
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

router.use(errorAuth)

export default router
