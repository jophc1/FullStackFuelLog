import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// Generate a JWT token with a identity from username_id and isAdmin
function jwtGenerate(userDetailsObj) {
  return jwt.sign(userDetailsObj, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
} 

// Returns a JWT identity in a jwt token that is in a cookie
function getJwtIdentityFromCookie(requestCookie) {
  return jwt.decode(requestCookie.accessToken)
}

// Takes in username and password from a basic authorization header and decodes it as an Object
const validateBasicAuth = async (req,res,next) => {
  try {
    let authHeader = req.headers["authorization"] ?? null
  
    if (authHeader == null) {
      throw new Error("No authentication data on request")
    }
  
    if (authHeader.startsWith("Basic ")) {
      authHeader = authHeader.substring(5).trim()
    }
  
    const decodedAuthHeader = Buffer.from(authHeader, 'base64').toString('ascii')
  
    let userLogin = { username_id: '', password: '' }
    userLogin.username_id = decodedAuthHeader.substring(0, decodedAuthHeader.indexOf(':'))
    userLogin.password = decodedAuthHeader.substring(decodedAuthHeader.indexOf(':') + 1)
    req.userAuthKey = userLogin
    next()
  } catch (err) {
    next(err)
  }
}

// Takes a decoded base64 object, searches if a db exists and sets a cookie in the header with a jwt token 
const verifyAuth = async (req,res,next) => {
  try {
    const user = await UserModel.findOne({ username_id: req.userAuthKey.username_id }) // may need to parse to int
    // Need to check if user exists first, otherwise the bcrypt compare throws an error if comparing with a null password
    if (!user) {
      throw new Error("Invalid Username/password") 
    }
    const matchPassword = await bcrypt.compare(req.userAuthKey.password, user.password)
    if (!matchPassword) {
      throw new Error("Invalid Username/password") 
    } else {
      const jwtUser = { username_id: req.userAuthKey.username_id, isAdmin: user.isAdmin, name: user.name, id: user._id }
      res.setHeader('Set-Cookie', [
      `accessToken=${jwtGenerate(jwtUser)}; HttpOnly; Max-Age=${24*3600}; SameSite=Secure` // added Secure so that only localhost or https schemes can be used
      ])
    } 
    next()
  } catch (err) {
    next(err)
  }
}

// Authenticates a jwt token in a cookie and query db if a user exists
const authAccess = async (req,res,next) => {
  try {
    // check if cookie with jwt exists
    if (!req.cookies.accessToken){
    throw new Error("Access denied, login first")
    }

    jwt.verify(req.cookies.accessToken, process.env.JWT_SECRET_KEY, (error, jwtIdentity) => {
      if (error) {
      throw new Error("Access denied, user not authenticated")
      }
      req.jwtIdentity = jwtIdentity
    })

    // const jwtIdentity = getJwtIdentityFromCookie(req.cookies)
    const user = await UserModel.findOne({ username_id: req.jwtIdentity.username_id })
    // if user no longer exists in db
    if (!user) {
      res.setHeader('Set-Cookie', [`accessToken=""; expires=${new Date().toUTCString()}; HttpOnly; SameSite=Secure`])
      throw new Error("User no longer exists") 
    }
    // valid cookie and jwt with a user, continue
    // req.jwtIdentity = jwtIdentity
    next()
  } catch (err) {
    next(err)
  }
}

// Uses the JWT identity to determine if the user is an admin/employee, 
// this middleware is paired with authAccess otherwise it won't work
const verifyAdmin = async (req,res,next) => {
  try {
    if (!req.jwtIdentity.isAdmin) {
    throw new Error("Unauthorized access")
    }
    next()
  } catch (err) {
    next(err)
  }
}

// Error middleware to catch errors, put this as last at the bottom of all use and routes
const errorAuth = (error,req,res,next) => {
  res.status(500).send({ authError: error.message })
}

export { errorAuth, validateBasicAuth, verifyAuth, getJwtIdentityFromCookie, authAccess, verifyAdmin }