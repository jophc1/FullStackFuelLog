import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    username_id: { type: Number, cast: false, required: true},
    password: { type: String, required: true},
    isAdmin: { type: Boolean, cast: false, required: true, default: false},
    log_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Log' }
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel