import { Router } from 'express'
import VehicleModel from '../models/Vehicle.js'
import fileUpload from 'express-fileupload'
import { postToS3 } from '../middleware/post_to_s3.js'
import { deleteObjectS3 } from '../middleware/delete_object_s3.js'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

const router = Router()
router.use(fileUpload())

router.use(authAccess)

// Get all vehicle assets
router.get('/', async (req, res) => {
  res.send(await VehicleModel.find())
})

// Get specific vehicle asset by asset ID (not the mongoDB generated _id)
router.get('/:asset_id', async (req, res) => {
  try {
    const vehicle = await VehicleModel.findOne({ asset_id: `${req.params.asset_id}` })
    vehicle ? res.send(vehicle) : res.status(404).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Create a new vehicle, employer only
router.post('/', verifyAdmin, postToS3, async (req, res) => {
  try {
    // save this in database with vehicle data to use to retrive img .png from S3 bucket
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.key}`
    // create new document
    const newVehicle = {
      ...req.body,
      vehicleImage_URL: url
    }
    // add the document
    const vehicleAdded = await VehicleModel.create(newVehicle)
    res.status(201).send(vehicleAdded)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Delete a specific vehicle by asset ID, employer only
router.delete('/:asset_id', verifyAdmin, deleteObjectS3, async (req, res) => {
  try {
    const targetVehicle = await VehicleModel.deleteOne({ asset_id: req.params.asset_id })
    targetVehicle ? res.sendStatus(200) : res.status(400).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Update a specific vehicle by asset ID, employer only
router.put('/:asset_id', verifyAdmin, postToS3, async (req, res) => {
  try {
    let url
    // check if asset_id has changed
    // if asset_id has changed and image has not been updated, keep the old asset id to use for image key in S3 bucket
    const oldVehicleData = await VehicleModel.findOne({ asset_id: req.params.asset_id }).exec()
    oldVehicleData.asset_id === req.body.asset_id && !req.files
      ? url = oldVehicleData.vehicleImage_URL
      : url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.key}`

    const vehicleUpdated = {
      ...req.body,
      vehicleImage_URL: url
    }
    const vehicle = await VehicleModel.updateOne({ asset_id: req.params.asset_id }, vehicleUpdated, { new: true })
    vehicle.matchedCount && vehicle.acknowledged ? res.send(vehicleUpdated) : res.status(404).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.use(errorAuth)

export default router
