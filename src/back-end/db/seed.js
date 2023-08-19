import LogModel from "../models/Log.js"
import UserModel from "../models/User.js"
import dotenv from 'dotenv'
import { dbClose, dbConnect } from "./db.js"


dotenv.config()

dbConnect()

await UserModel.deleteMany().then(() => console.log("Seed: users deleted"))
await LogModel.deleteMany().then(() => console.log("Seed: logs deleted"))

const user = await UserModel.create({
    name: 'Jordan',
    username_id: 1111,
    password: 'test password',
    isAdmin: true
})

const log = await LogModel.create({
    current_odo: 141000,
    fuel_added: 54,
    user_id: user
})

dbClose()