import express from 'express'
import cors from 'cors'
import dotenv from'dotenv'
import vehicleRouter from './routes/vehicle_routes.js'
import logReviewRouter from './routes/log_review_routes.js'
import { dbConnect } from './db/db.js'

dotenv.config()
dbConnect()
const app = express()

app.use(cors())
app.use(express.json())

// collection routes
app.use('/vehicles', vehicleRouter)
app.use('/logs/reviews', logReviewRouter)

export default app