import mongoose from 'mongoose'

function usernameIdValidate (value) {
  return value > 10000
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username_id: { type: Number, required: true, unique: true, validate: usernameIdValidate },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
