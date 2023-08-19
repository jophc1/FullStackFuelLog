import express from 'express'


const authRouter = express.Router()

// Route to check a requested username and password
// if a match occurs, send back a JWT else send an error message saying wrong email/password


export default authRouter