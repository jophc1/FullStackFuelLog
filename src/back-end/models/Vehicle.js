import mongoose from 'mongoose'

const vehicleSchema = mongoose.Schema({
  asset_id: { 
    type: String,
    required: true,
    unique: true
  },
  registration: {
    type: String,
    required: true,
    unique: true
  },
  make: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true,
  },
  vehicleImage_URL: {
    type: String,
    required: true,
    unique: true
  }
})

const VehicleModel = mongoose.model('Vehicle', vehicleSchema)

export default VehicleModel
