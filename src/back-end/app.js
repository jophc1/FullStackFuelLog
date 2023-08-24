import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import vehicleRouter from './routes/vehicle_routes.js'
import logReviewRouter from './routes/log_review_routes.js'
import authRouter from './routes/auth_routes.js'
import analyticalRouter from './routes/analytical_routes.js'
import logsRouter from './routes/log_routes.js'
import { dbConnect } from './db/db.js'
import employerUserRouter from './routes/user_routes.js'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'

// Cors options and whitelisting
// TODO: NEED TO ADD WHITELIST FOR DEPLOYED REACT APP SERVER IP ADDRESS
const whitelist = ['http://localhost:5173', '127.0.0.1:5173'] 
const corsOptions = {
  credentials: true,
  origin: function(origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1){
       callback(null, true)
    } else {
      callback(new Error('Blocked by CORS'))
    }
  }
}

dotenv.config()
dbConnect()
const app = express()

app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      'script-src': ["'self'"]
    }
  }
}))

// collection routes

app.use('/vehicles', vehicleRouter)
app.use('/logs/reviews', logReviewRouter)
app.use('/employed', employerUserRouter)
app.use('/auth', authRouter)
app.use('/reports', analyticalRouter)
app.use('/logs', logsRouter)

export default app
