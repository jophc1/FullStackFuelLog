import LogModel from "../models/Log.js"
import UserModel from "../models/User.js"
import VehicleModel from "../models/Vehicle.js"
import dotenv from 'dotenv'
import { dbClose, dbConnect } from "./db.js"

import bcrypt from 'bcrypt'

dotenv.config()

dbConnect()

await UserModel.deleteMany().then(() => console.log("Seed: users deleted"))
await LogModel.deleteMany().then(() => console.log("Seed: logs deleted"))

const salt = process.env.SALT_ADD

const users = [
  {
    name: 'admin',
    username_id: 1111,
    password: await bcrypt.hash('test password', salt),
    isAdmin: true
  },
  {
    name: 'John Smith',
    username_id: 10001,
    password: await bcrypt.hash('johnSmith', salt)
  },
  {
    name: 'Dom Torretto',
    username_id: 10002,
    password: await bcrypt.hash('FamilyIsTheBestFam', salt)
  }
]
console.log('finished users')
const arrayUsers = await UserModel.insertMany(users)

// console.log(await bcrypt.compare('test password', arrayUsers[0].password))

const log = [
  {
    current_odo: 141000,
    fuel_added: 54,
    user_id: arrayUsers[1]
  }
]

dbClose()