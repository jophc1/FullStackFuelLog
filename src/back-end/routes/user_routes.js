import express from 'express'
import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import { authAccess, verifyAdmin, errorAuth } from '../middleware/auth_mw.js'
import LogReviewModel from '../models/LogReview.js'

const router = express.Router()

router.use(authAccess)

// Update an employee route
router.put('/:username_id', async (req, res) => {
  try {
    const saltRounds = 10
    if (req.body.password && req.body.password.length < 8) {
      res.status(500).send({ error: 'Password must be 8 characters or more' })
    } else {
      if (req.jwtIdentity.isAdmin || req.jwtIdentity.username_id === req.params.username_id) {
        if (req.body.password) {
          req.body.password = await bcrypt.hash(req.body.password, saltRounds)
        }
        const targetEmployee = await UserModel.updateOne({ username_id: req.params.username_id }, req.body, { new: true, runValidators: true })
        targetEmployee.acknowledged && targetEmployee.matchedCount ? res.status(201).send(targetEmployee) : res.status(202).send({ message: 'no updates made' })
      } else {
        res.status(401).send({ error: 'Not authorised' })
      }
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(verifyAdmin)

// Get all employees route
router.get('/', async (req, res) => {
  try {
    const employees = await UserModel.find({ isAdmin: false }, 'name username_id')
    employees ? res.status(200).send(employees) : res.status(404).send({ error: 'No employee records' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Create a employee route
router.post('/', async (req, res) => {
  try {
    const saltRounds = 10
    if (req.body.password.length < 8) {
      res.status(500).send({ error: 'Password must be 8 characters or more' })
    } else {
      const { _id } = await UserModel.create({
        name: req.body.name,
        username_id: req.body.username_id,
        password: await bcrypt.hash(req.body.password, saltRounds)
      })
      res.send(await UserModel.findById(_id, '-password -isAdmin'))
    }
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Get employee by username_id
router.get('/:username_id', async (req, res) => {
  try {
    const employee = await UserModel.findOne({ username_id: req.params.username_id }, 'name username_id')
    employee ? res.status(200).send(employee) : res.status(404).send({ error: 'Employee record not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Delete an employee
router.delete('/:username_id', async (req, res) => {
  const employeeDetails = await UserModel.findOne({ username_id: req.params.username_id })
  const targetEmployee = await UserModel.deleteOne({ username_id: req.params.username_id })

  await LogReviewModel.deleteOne({ employee_id: employeeDetails._id })

  targetEmployee.acknowledged && targetEmployee.deletedCount ? res.status(201).send(targetEmployee) : res.status(202).send({ message: 'No employee deleted' })
})

router.use(errorAuth)

export default router
