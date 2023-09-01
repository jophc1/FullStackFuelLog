import LogModel from '../models/Log.js'
import UserModel from '../models/User.js'
import VehicleModel from '../models/Vehicle.js'
import dotenv from 'dotenv'
import { dbClose, dbConnect } from './db.js'
import bcrypt from 'bcrypt'
import LogReviewModel from '../models/LogReview.js'

dotenv.config()

dbConnect()

await UserModel.deleteMany().then(() => console.log('Seed: users deleted'))
await LogModel.deleteMany().then(() => console.log('Seed: logs deleted'))
await LogReviewModel.deleteMany()
console.log('Seed: Reviews deleted')

const salt = process.env.SALT_ADD

const users = [
  {
    name: 'Empolyer Admin',
    username_id: 10001,
    password: await bcrypt.hash('test password', salt),
    isAdmin: true
  },
  {
    name: 'John Smith',
    username_id: 10002,
    password: await bcrypt.hash('johnSmith', salt)
  },
  {
    name: 'Dom Torretto',
    username_id: 10003,
    password: await bcrypt.hash('FamilyIsTheBestFam', salt)
  }
]

const arrayUsers = await UserModel.insertMany(users)

const vehicles = [
  {
    asset_id: 'HRT1',
    registration: 'XO85IP',
    make: 'Hino',
    model: '500 Series',
    year: 2022,
    vehicleImage_URL: 'https://fuel-log-app.s3.ap-southeast-2.amazonaws.com/HRT1.png'
  },
  {
    asset_id: 'HRT2',
    registration: 'X105IK',
    make: 'Fuso',
    model: 'Shogun',
    year: 2022,
    vehicleImage_URL: 'https://fuel-log-app.s3.ap-southeast-2.amazonaws.com/HRT2.png'
  },
  {
    asset_id: 'HRT3',
    registration: 'X023IP',
    make: 'Iveco',
    model: 'Eurocargo ML180',
    year: 2022,
    vehicleImage_URL: 'https://fuel-log-app.s3.ap-southeast-2.amazonaws.com/HRT3.png'
  },
  {
    asset_id: 'HRT4',
    registration: 'X050IK',
    make: 'Fuso',
    model: 'Fighter',
    year: 2022,
    vehicleImage_URL: 'https://fuel-log-app.s3.ap-southeast-2.amazonaws.com/HRT4.png'
  }
]

await VehicleModel.deleteMany()
console.log('Vehicles deleted')
const insertedVehicles = await VehicleModel.insertMany(vehicles)
console.log('Vehicles inserted')

// log entry seeds for each vehicle
const logVehicleOne = [
  {
    current_odo: 8900,
    fuel_added: 150,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-06-07')
  },
  {
    current_odo: 9402,
    fuel_added: 100,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-06-13')
  },
  {
    current_odo: 9740,
    fuel_added: 80,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-06-15')
  },
  {
    current_odo: 9989,
    fuel_added: 50,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-06-20')
  },
  {
    current_odo: 10233,
    fuel_added: 56,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-06-28')
  },
  {
    current_odo: 10456,
    fuel_added: 42,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-07-02')
  },
  {
    current_odo: 11021,
    fuel_added: 120,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-07-10')
  },
  {
    current_odo: 11427,
    fuel_added: 85,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-07-20')
  },
  {
    current_odo: 12203,
    fuel_added: 180,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-07-28')
  },
  {
    current_odo: 13109,
    fuel_added: 185,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-08-05')
  },
  {
    current_odo: 13501,
    fuel_added: 82,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-08-07')
  },
  {
    current_odo: 13689,
    fuel_added: 32,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[0],
    date: new Date('2023-08-13')
  }
]

const logVehicleTwo = [
  {
    current_odo: 1900,
    fuel_added: 150,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-06-07')
  },
  {
    current_odo: 2402,
    fuel_added: 200,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-06-13')
  },
  {
    current_odo: 2740,
    fuel_added: 125,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-06-15')
  },
  {
    current_odo: 2989,
    fuel_added: 89,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-06-20')
  },
  {
    current_odo: 3233,
    fuel_added: 108,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-06-28')
  },
  {
    current_odo: 3456,
    fuel_added: 85,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-07-02')
  },
  {
    current_odo: 4021,
    fuel_added: 250,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-07-10')
  },
  {
    current_odo: 4427,
    fuel_added: 170,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-07-20')
  },
  {
    current_odo: 4703,
    fuel_added: 123,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-07-28')
  },
  {
    current_odo: 5109,
    fuel_added: 169,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-08-05')
  },
  {
    current_odo: 5501,
    fuel_added: 180,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-08-07')
  },
  {
    current_odo: 6389,
    fuel_added: 350,
    user_id: arrayUsers[2],
    vehicle_id: insertedVehicles[1],
    date: new Date('2023-08-13')
  }
]

const logVehicleThree = [
  {
    current_odo: 8900,
    fuel_added: 150,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-06-09')
  },
  {
    current_odo: 9402,
    fuel_added: 125,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-06-10')
  },
  {
    current_odo: 9740,
    fuel_added: 78,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-06-25')
  },
  {
    current_odo: 9989,
    fuel_added: 56,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-06-29')
  },
  {
    current_odo: 10233,
    fuel_added: 80,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-07-07')
  },
  {
    current_odo: 10456,
    fuel_added: 60,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-07-18')
  },
  {
    current_odo: 11021,
    fuel_added: 180,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-07-22')
  },
  {
    current_odo: 11427,
    fuel_added: 105,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-07-27')
  },
  {
    current_odo: 12203,
    fuel_added: 210,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-07-29')
  },
  {
    current_odo: 13109,
    fuel_added: 224,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-08-04')
  },
  {
    current_odo: 13501,
    fuel_added: 102,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-08-09')
  },
  {
    current_odo: 13689,
    fuel_added: 29,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[2],
    date: new Date('2023-08-17')
  }
]

const logVehicleFour = [
  {
    current_odo: 20900,
    fuel_added: 200,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-06-09')
  },
  {
    current_odo: 21402,
    fuel_added: 130,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-06-10')
  },
  {
    current_odo: 21740,
    fuel_added: 90,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-06-25')
  },
  {
    current_odo: 21989,
    fuel_added: 60,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-06-29')
  },
  {
    current_odo: 22233,
    fuel_added: 82,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-07-07')
  },
  {
    current_odo: 22456,
    fuel_added: 52,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-07-18')
  },
  {
    current_odo: 23021,
    fuel_added: 172,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-07-22')
  },
  {
    current_odo: 23427,
    fuel_added: 106,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-07-27')
  },
  {
    current_odo: 24203,
    fuel_added: 210,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-07-29')
  },
  {
    current_odo: 25109,
    fuel_added: 234,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-08-04')
  },
  {
    current_odo: 25501,
    fuel_added: 109,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-08-09')
  },
  {
    current_odo: 25689,
    fuel_added: 40,
    user_id: arrayUsers[1],
    vehicle_id: insertedVehicles[3],
    date: new Date('2023-08-17')
  }
]

await LogModel.deleteMany()
console.log('Logs deleted')
const insertedLogs = await LogModel.insertMany([...logVehicleOne, ...logVehicleTwo, ...logVehicleThree, ...logVehicleFour])
console.log('Logs inserted')

dbClose()
