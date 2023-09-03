import mongoose from 'mongoose'

function usernameIdValidate (value) {
  return value > 10000
}

function nameValidation (val) {
  return /^[A-Z][a-z]+\s[A-Z][a-z]+$/.test(val)
}

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, validate: nameValidation },
  username_id: { type: Number, required: true, unique: true, validate: usernameIdValidate },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false }
})

const UserModel = mongoose.model('User', UserSchema)

export default UserModel
