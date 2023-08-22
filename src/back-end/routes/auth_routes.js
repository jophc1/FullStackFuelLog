import express from 'express'
import { errorAuth, validateBasicAuth, verifyAuth } from '../middleware/auth_mw.js'

const router = express.Router()

// Route to check a requested username and password
// if a match occurs, send back a JWT else send an error message saying wrong email/password
// will use 2 middlewares, validateBasicAuth, and verifyAuth
// validate basic auth will extract username_id and password from 'authorization' header, split the details from 'Basic ', and decode from Buffer
// the next middleware verifyAuth finds the user by the decoded username_id, then compares the passwords


// login route, return is_admin in response to differentiate employee and employer for front end dashboard render
router.get('/', validateBasicAuth, verifyAuth, async (req, res) => {
    console.log("start get login")
   
    console.log("end get login")
    res.status(200).send({ message: "Login successful" })
   
})

router.use(errorAuth)

export default router