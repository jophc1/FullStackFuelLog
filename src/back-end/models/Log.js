import mongoose from 'mongoose'

const LogSchema = new mongoose.Schema({
    date: { type: Date, cast: false, default: new Date() },
    current_odo: { type: Number, required: true, cast: false },
    fuel_added: { type: Number, required: true, cast: false },
    vehicle_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})

const LogModel = mongoose.model('Log', LogSchema)

export default LogModel