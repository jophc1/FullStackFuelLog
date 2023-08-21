import UserModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

function jwtGenerate(userDetailsObj) {
  return jwt.sign(userDetailsObj, process.env.JWT_SECRET_KEY, { expiresIn: '1d' })
} 

function getJwtIdentityFromCookie(requestCookie) {
  return jwt.decode(requestCookie.accessToken)
}

const validateBasicAuth = async (req,res,next) => {
  let authHeader = req.headers["authorization"] ?? null

  if (authHeader == null) {
    next(new Error("No authentication data on request"))
  }

  if (authHeader.startsWith("Basic ")) {
    authHeader = authHeader.substring(5).trim()
  }

  const decodedAuthHeader = Buffer.from(authHeader, 'base64').toString('ascii')

  let userLogin = { username: '', password: '' }
  userLogin.username = decodedAuthHeader.substring(0, decodedAuthHeader.indexOf(':'))
  userLogin.password = decodedAuthHeader.substring(decodedAuthHeader.indexOf(':') + 1)

  req.userAuthKey = userLogin

  next()
}

const verifyAuth = async (req,res,next) => {
  const user = await UserModel.findOne({ username_id: req.userAuthKey.username }) // may need to parse to int

  const matchPassword = await bcrypt.compare(req.userAuthKey.password, user.password)
  if (!matchPassword) {
    next(new Error("Invalid Username/password")) 
  } else {
    const jwtUser = { username_id: req.userAuthKey.username, isAdmin: user.isAdmin }
    res.setHeader('Set-Cookie', [
    `accessToken=${jwtGenerate(jwtUser)}; HttpOnly; Max-Age=${24*3600}; SameSite=Secure` // added Secure so that only localhost or https schemes can be used
    ])

  }
  next()
}

// verifyAdmin may not be needed, check this later
// const verifyAdmin = async (req,res,next) => {
//   const jwtUserIdentity = jwt.decode(req.cookies.accessToken)
  
//   if (!jwtUserIdentity.isAdmin) {
//   next(new Error("Not an admin"))
//   }

//   next()
// }

const errorAuth = async (error,req,res,next) => {
  res.status(500).send({ error: error.message })
}

export { errorAuth, validateBasicAuth, verifyAuth, getJwtIdentityFromCookie }