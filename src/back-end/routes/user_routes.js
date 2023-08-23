import express from 'express'
import UserModel from '../models/User.js'
import bcrypt from 'bcrypt'
import { authAccess, verifyAdmin, errorAuth } from '../middleware/auth_mw.js'

const router = express.Router()

router.use(authAccess)
router.use(verifyAdmin)

// Get all employees route
router.get('/', async (req, res) => {
  try {
    const employees = await UserModel.find({ isAdmin: false }, 'name username_id')
    employees ? res.status(200).send(employees) : res.status(404).send({ error: "No employee records" })
  }
  catch (err){
    res.status(500).send({ error: err.message })
  }
  })

// Create a employee route
router.post('/', async (req, res) => {
  try {
    const { _id } = await UserModel.create({
    name: req.body.name,
    username_id: req.body.username_id,
    password: await bcrypt.hash(req.body.password, process.env.SALT_ADD)
    })
    res.send(await UserModel.findById(_id, '-password -isAdmin'))
  }
  catch (err){
    res.status(500).send({ error: err.message })
  }
  })

// Get employee by username_id
router.get('/:username_id', async (req, res) => {
  try {
    const employee = await UserModel.findOne({ username_id: req.params.username_id }, 'name username_id')
    employee ? res.status(200).send(employee) : res.status(404).send( { error: "Employee record not found" } )
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Delete an employee
router.delete('/:username_id', async (req, res) => {
  const targetEmployee = await UserModel.deleteOne({ username_id: req.params.username_id })
  targetEmployee.acknowledged && targetEmployee.deletedCount ? res.status(201).send(targetEmployee) : res.status(202).send({ message: "No employee deleted"})
})

//Update an employee route
router.put('/:username_id', async (req, res) => {
  try {
    const targetEmployee = await UserModel.updateOne( { username_id: req.params.username_id }, req.body , { new: true, runValidators: true })
    targetEmployee.acknowledged && targetEmployee.matchedCount ? res.status(201).send(targetEmployee) : res.status(202).send({ message: `no updates made` })
  } catch (err) {
    res.status(500).send( { error: err.message})
  }
})

router.use(errorAuth)

export default router