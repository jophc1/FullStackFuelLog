import { Router } from 'express'
import VehicleModel from '../models/Vehicle.js'
import fileUpload from 'express-fileupload'
import { postToS3 } from '../middleware/post_to_s3.js'
import { deleteObjectS3 } from '../middleware/delete_object_s3.js'
import { errorAuth, authAccess, verifyAdmin } from '../middleware/auth_mw.js'

const router = Router()
router.use(fileUpload())

router.use(authAccess)

router.get('/', async (req, res) => {
  res.send(await VehicleModel.find())
})

router.get('/:asset_id', async (req, res) => {
  try {
    const vehicle = await VehicleModel.findOne({ asset_id: `${req.params.asset_id}` })
    vehicle ? res.send(vehicle) : res.status(404).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.post('/', verifyAdmin, postToS3, async (req, res) => {
  try {
    // save this in database with vehicle data to use to retrive img .png from S3 bucket
    const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.key}.png`
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

router.delete('/:asset_id', verifyAdmin, deleteObjectS3, async (req, res) => {
  try {
    const vehicle = await VehicleModel.deleteOne({ asset_id: req.params.asset_id })
    vehicle ? res.sendStatus(200) : res.status(400).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.put('/:asset_id', verifyAdmin, postToS3, async (req, res) => {
  try {
    let url
    // check if asset_id has changed
    // if asset_id has changed and image has not been updated, keep the old asset id to use for image key in S3 bucket
    const oldVehicleData = await VehicleModel.findOne({ asset_id: req.params.asset_id }).exec()
    oldVehicleData.asset_id !== req.body.asset_id && !req.files
      ? url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${oldVehicleData.asset_id}.png`
      : url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.key}.png`

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
