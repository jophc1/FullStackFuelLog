import app from './app.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import LogModel from './models/Log.js'
import VehicleModel from './models/Vehicle.js'
import LogReviewModel from './models/LogReview.js'
import { dbConnect, dbClose } from './db/db.js'
import { jest } from '@jest/globals'

// If returnCookie is set to true, return a cookie instead of returning a response
async function loginUser (userID, password, returnCookie) {
  const login = await
  request(app)
    .get('/auth/login')
    .auth(userID, password)
  if (returnCookie) {
    const cookie = login.headers['set-cookie']
    return cookie
  }
  return login
}

describe('App Tests', () => {
  describe('Authentication', () => {
    test('should authenticate admin user when making a request to GET /auth/login', async () => {
      const res = await loginUser('10001', 'test password', false)
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Login successful')
    })

    test('should return no auth data in request when no auth header is sent', async () => {
      const res = await
      request(app)
        .get('/auth/login')
      expect(res.status).toBe(500)
      expect(res.body.authError).toMatch('No auth')
    })

    test('should return error message with incorrect auth details', async () => {
      const res = await loginUser('10001', 'random', false)
      expect(res.status).toBe(500)
      expect(res.body.authError).toMatch('Invalid')
    })

    test('should save cookies with the access token', async () => {
      const res = await
      request(app)
        .get('/auth/login')
        .auth('10001', 'test password')
        .expect('set-cookie', /accessToken/)
    })
  })

  describe('Authorisation', () => {
    let cookie
    // Don't need to relogin for each test when logout will remove current cookie
    beforeAll(async () => {
      cookie = await loginUser('10002', 'johnSmith', true)
    })

    test('should prevent access of Employer routes', async () => {
      const res = await
      request(app)
        .get('/employed')
        .set('Cookie', cookie)
      expect(res.body.authError).toMatch('Unauth')
    })

    test('should logout a user successfully', async () => {
      const res = await
      request(app)
        .get('/auth/logout')
        .expect(200)
      cookie = res.headers['set-cookie']
      expect(cookie[0].length).toBe(83) // checking cookie string length, if access token is empty then it should only be 83 long
    })
  })

  describe('User routes, Log and Log Review routes', () => {
    describe('Employer routes', () => {
      let cookie
      const testEmployeeID = 99999

      beforeAll(async () => {
        cookie = await loginUser('10001', 'test password', true)
      })

      test('should create a new employee', async () => {
        const res = await
        request(app)
          .post('/employed')
          .set('Cookie', cookie)
          .send({ name: 'Test Employee', username_id: testEmployeeID, password: 'testPassword' })
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.password).toBeUndefined()
        expect(res.body.name).toBe('Test Employee')
      })

      test('should update newly created employee', async () => {
        const res = await
        request(app)
          .put('/employed/' + testEmployeeID)
          .set('Cookie', cookie)
          .send({ name: 'Update Employee' })
        expect(res.body.modifiedCount).toBe(1)
      })

      test('should delete the newly created employee', async () => {
        const res = await
        request(app)
          .delete('/employed/' + testEmployeeID)
          .set('Cookie', cookie)
        expect(res.body.deletedCount).toBe(1)
      })
    })

    describe('Employee routes', () => {
      let cookie
      let userID
      let latestVehicleOdometer
      let vehicleIDString
      let vehicle
      let recentLog
      let recentLogReview

      beforeAll(async () => {
        // search for the first vehicle, get the string version of the _id
        vehicle = await VehicleModel.findOne()
        vehicleIDString = vehicle._id.toString()
        // Get the latest log of the queried vehicle so a recent odometer is obtained
        const lastLog = await LogModel.find({ vehicle_id: vehicle._id }).sort({ current_odo: -1 })
        latestVehicleOdometer = lastLog[0].current_odo
        // Login as employee and set cookie
        cookie = await loginUser('10002', 'johnSmith', true)
        // Obtain user ID from identity in cookie
        const jwtString = cookie[0].substring('12', cookie[0].indexOf(';'))
        const jwtIdentity = jwt.decode(jwtString)
        userID = new mongoose.Types.ObjectId(jwtIdentity.id)
      })

      test('should return correct keys monthly report for employee dashboard', async () => {
        const res = await
        request(app)
          .get('/reports/employee/current/month')
          .set('Cookie', cookie)
          .expect(200)
        expect(res.body.fuelTotal).toBeDefined()
        expect(res.body.totalFuelLogs).toBeDefined()
        expect(res.body.vehicleCount).toBeDefined()
      })

      test('should be able to create a new log', async () => {
        const res = await
        request(app)
          .post('/logs')
          .set('Cookie', cookie)
          .send({ fuel_added: 200, current_odo: latestVehicleOdometer + 100, user_id: userID, vehicle_id: vehicleIDString })
          .expect(200)

        recentLog = await LogModel.find({ vehicle_id: vehicle._id }).sort({ current_odo: -1 })
        expect(recentLog[0].current_odo).toBe(latestVehicleOdometer + 100)
        expect(recentLog[0].vehicle_id).toStrictEqual(vehicle._id)
      })

      test('should be able to request a log review', async () => {
        const res = await
        request(app)
          .post('/logs/reviews')
          .set('Cookie', cookie)
          .send({ log_id: recentLog[0]._id })
          .expect(201)

        recentLogReview = await LogReviewModel.find({ employee_id: recentLog[0].user_id }).sort({ date: -1 })
        expect(res.body.log_id).toBeDefined()
        expect(res.body.employee_id).toBe(recentLog[0].user_id.toString())
      })

      test('should be able to remove the newly created log (Employer access)', async () => {
        // login as admin/employer and return cookie
        cookie = await loginUser('10001', 'test password', true)
        // query db for log based on log ID (from test above)
        const recentLogIdString = recentLog[0]._id.toString()
        const deleteLog = await
        request(app)
          .delete('/logs/' + recentLogIdString)
          .set('Cookie', cookie)
          .expect(200)
        // Check that deleted log is in response with 200 status
        expect(deleteLog.body).toStrictEqual({})
      })

      test('should be able to get all log reviews (Employer access)', async () => {
        const res = await
        request(app)
          .get('/logs/reviews')
          .set('Cookie', cookie)
          .expect(200)
      })

      test('should be able to remove the log review (Employer access)', async () => {
        cookie = await loginUser('10001', 'test password', true)
        const recentLogReviewIdString = recentLogReview[0]._id.toString()
        const deleteLogReview = await
        request(app)
          .delete('/logs/reviews/' + recentLogReviewIdString)
          .set('Cookie', cookie)
          .expect(200)
        // Check that deleted log is in response with 200 status
        expect(deleteLogReview.text).toStrictEqual('OK')
      })
    })
  })

  describe('Log routes', () => {
    describe('Employer routes', () => {

    })
  })

  describe('Vechicle routes', () => {
    describe('Employer routes', () => {
      let cookie
      const testAssetID = 'TESTID'

      beforeAll(async () => {
        cookie = await loginUser('10001', 'test password', true)
      })

      test('should be able to post a new vehicle (no image provided in test)', async () => {
        const res = await
        request(app)
          .post('/vehicles')
          .set('Cookie', cookie)
          .send({ asset_id: testAssetID, registration: 'TESTREGO', make: 'GENERIC', model: 'GENERIC', year: 2023 })
          .expect(201)
        expect(res.body.asset_id).toBeDefined()
      })

      test('should be able to update vehicle details', async () => {
        const res = await
        request(app)
          .put('/vehicles/' + testAssetID)
          .set('Cookie', cookie)
          .send({ asset_id: testAssetID, registration: 'CHANGEDREGO', year: 2022 })
          .expect(200)
        expect(res.body.registration).toBe('CHANGEDREGO')
        expect(res.body.year).toBe(2022)
      })

      test('should delete the newly created test vehicle', async () => {
        const res = await
        request(app)
          .delete('/vehicles/' + testAssetID)
          .set('Cookie', cookie)
          .expect(200)
        expect(res.body).toStrictEqual({})
      })
    })

    describe('Employee routes', () => {
      let cookie
      // let testAssetID = 'TESTID'

      beforeAll(async () => {
        cookie = await loginUser('10002', 'johnSmith', true)
      })

      test('should be able to get all vehicles', async () => {
        const res = await
        request(app)
          .get('/vehicles')
          .set('Cookie', cookie)
          .expect(200)
        expect(res.body.length).toBeGreaterThan(0)
      })

      test('should be able to get a vehicle by asset_id', async () => {
        const res = await
        request(app)
          .get('/vehicles/HRT4')
          .set('Cookie', cookie)
          .expect(200)
        expect(res.body.asset_id).toBe('HRT4')
      })
    })
  })

  describe('Analytical routes', () => {
    describe('Employer routes', () => {

    })
  })

  describe('DB Connect', () => {
    beforeAll(async () => {
      await dbClose()
    })
    test('should connect to DB and console log connection success', async () => {
      const logSpy = jest.spyOn(global.console, 'log')

      await dbConnect()

      expect(logSpy).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith('Mongoose connected')
      expect(logSpy.mock.calls).toContainEqual(['Mongoose connected'])
    })
  })

  describe('DB Connect production', () => {
    const OLD_ENV = process.env.ENV

    beforeAll(async () => {
      await dbClose()
      // clear the cache
      jest.resetModules()
      // make a copy
      process.env.ENV = OLD_ENV
    })

    afterAll(() => {
      process.env.ENV = OLD_ENV
    })

    test('should connect to production DB based on env', async () => {
      process.env.ENV = 'prod'
      const logSpy = jest.spyOn(global.console, 'log')

      await dbConnect()

      expect(logSpy).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith('PRODUCTION: Mongoose connected')
    })
  })

  describe('DB Disconnect', () => {
    test('should close the connection to the DB', async () => {
      const logSpy = jest.spyOn(global.console, 'log')

      await dbClose()

      expect(logSpy).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalledWith('Mongoose disconnected')
      expect(logSpy.mock.calls).toContainEqual(['Mongoose disconnected'])
    })
  })
})
