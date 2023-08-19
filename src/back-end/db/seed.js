import LogModel from "../models/Log.js"
import UserModel from "../models/User.js"
import VehicleModel from "../models/Vehicle.js"
import dotenv from 'dotenv'
import { dbClose, dbConnect } from "./db.js"

import bcrypt from 'bcrypt'

const saltRounds = 21
const saltAdding = await bcrypt.genSalt(saltRounds)

dotenv.config()

dbConnect()

await UserModel.deleteMany().then(() => console.log("Seed: users deleted"))
await LogModel.deleteMany().then(() => console.log("Seed: logs deleted"))

// const addedSalt = process.env.SALT_ADD
// console.log(bcrypt.hash('test password', saltAdding))

const users = [
  {
    name: 'admin',
    username_id: 1111,
    password: await bcrypt.hash('test password', saltAdding),
    isAdmin: true
  },
  {
    name: 'John Smith',
    username_id: 10001,
    password: await bcrypt.hash('johnSmith', saltAdding)
  },
  {
    name: 'Dom Torretto',
    username_id: 10002,
    password: await bcrypt.hash('FamilyIsTheBestFam', saltAdding)
  }
]
console.log('finished users')
const arrayUsers = await UserModel.insertMany(users)

// const log = [
//   {
//     current_odo: 141000,
//     fuel_added: 54,
//     user_id: arrayUsers[1]
//   }
// ]

dbClose()