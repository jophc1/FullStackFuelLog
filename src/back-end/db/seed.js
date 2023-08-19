import LogModel from "../models/Log.js"
import UserModel from "../models/User.js"
import VehicleModel from "../models/Vehicle.js"
import dotenv from 'dotenv'
import { dbClose, dbConnect } from "./db.js"


dotenv.config()

dbConnect()

await UserModel.deleteMany().then(() => console.log("Seed: users deleted"))
await LogModel.deleteMany().then(() => console.log("Seed: logs deleted"))


const users = [
  {
    name: 'admin',
    username_id: 1111,
    password: 'test password',
    isAdmin: true
  },
  {
    name: 'John Smith',
    username_id: 10001,
    password: 'johnSmith',
  },
  {
    name: 'Dom Torretto',
    username_id: 10002,
    password: 'FamilyIsTheBestFam',
  }
]


const log = [
  {
    current_odo: 141000,
    fuel_added: 54,
    user_id: users[1]
  }
]

dbClose()