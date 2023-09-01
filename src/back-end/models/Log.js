import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

function fuelAddedValidation (val) {
  return val > 0
}

const LogSchema = new mongoose.Schema({
  date: { type: Date, cast: false, default: new Date() },
  current_odo: { type: Number, required: true, cast: false },
  fuel_added: { type: Number, required: true, cast: false, validate: fuelAddedValidation },
  vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

LogSchema.plugin(mongoosePaginate)

const LogModel = mongoose.model('Log', LogSchema)

export default LogModel
