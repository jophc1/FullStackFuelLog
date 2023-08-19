import express from 'express'
import cors from 'cors'
import dotenv from'dotenv'
import vehicleRouter from './routes/vehicle_routes.js'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// collection routes
app.use('/vehicles', vehicleRouter)

export default app