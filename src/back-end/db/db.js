import mongoose from 'mongoose'

async function dbConnect () {
  try {
    if (process.env.ENV === 'prod') {
      await mongoose.connect(`${process.env.ATLAS_DB_URL}`)
      console.log('PRODUCTION: Mongoose connected')
    } else {
      await mongoose.connect(`${process.env.LOCAL_DB_URL}/fuel_log`)
    }
    // console.log('Mongoose connected')
  } catch (err) {
    console.log({ error: err.message })
  }
}

async function dbClose () {
  mongoose.connection.close()
  console.log('Mongoose disconnected')
}

export {
  dbConnect,
  dbClose
}
