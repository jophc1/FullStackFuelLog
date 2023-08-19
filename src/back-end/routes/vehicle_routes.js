import { Router } from 'express'
import VehicleModel from '../models/Vehicle.js'
import fileUpload from 'express-fileupload'
import { postToS3 } from '../middleware/post_to_s3.js'

const router = Router()
router.use(fileUpload())

router.get('/', async (req, res) => {
  res.send(await VehicleModel.find())
})

router.post('/', postToS3, async (req, res) => {
  try {
     // save this in database with vehicle data to use to retrive img .png from S3 bucket
     const url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.body.asset_id}`
     const newVehicle = {
      ...req.body,
      vehicleImage_URL: url
     }
     const vehicleAdded = await VehicleModel.create(newVehicle)
     res.status(201).send(vehicleAdded)
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const vehicle = await VehicleModel.findByIdAndDelete(req.params.id)
    vehicle ? res.sendStatus(200) : res.status(400).send({ error: 'Vehicle not found' })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

router.put('/:id', postToS3, async (req, res) => {
  try {
    let url
    let vehicleUpdated = {...req.body}
    if (!req.files.image) {
      url = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${req.body.asset_id}`
      vehicleUpdated.vehicleImage_URL = url
    }
    const vehicle = await VehicleModel.findByIdAndUpdate(req.params.id, vehicleUpdated, { new: true })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

export default router