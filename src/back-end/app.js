import express from 'express'
import cors from 'cors'
import dotenv from'dotenv'
import vehicleRouter from './routes/vehicle_routes.js'
import logReviewRouter from './routes/log_review_routes.js'
import authRouter from './routes/auth_routes.js'
import analyticalRouter from './routes/analytical_routes.js'
import { dbConnect } from './db/db.js'
import employerUserRouter from './routes/user_routes.js'

dotenv.config()
dbConnect()
const app = express()

app.use(cors())
app.use(express.json())

// collection routes
app.use('/vehicles', vehicleRouter)
app.use('/logs/reviews', logReviewRouter)
app.use('/employed', employerUserRouter)
app.use('/login', authRouter)
app.use('/reports', analyticalRouter)

export default app