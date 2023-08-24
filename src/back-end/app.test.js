import app from './app.js'
import request from 'supertest'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import LogModel from './models/Log.js'
import VehicleModel from './models/Vehicle.js'

describe('App Tests', () => {
  describe('Authentication', () => {
    test('should authenticate admin user when making a request to GET /auth/login', async () => {
      const res = await
      request(app)
        .get('/auth/login')
        .auth('10001', 'test password')
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
      const res = await
      request(app)
        .get('/auth/login')
        .auth('10001', 'random')
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
      const login = await
      request(app)
        .get('/auth/login')
        .auth('10002', 'johnSmith')

      cookie = login.headers['set-cookie']
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

  describe('User routes', () => {
    describe('Employer routes', () => {
      let cookie
      const testEmployeeID = 99999

      beforeAll(async () => {
        const login = await
        request(app)
          .get('/auth/login')
          .auth('10001', 'test password')

        cookie = login.headers['set-cookie']
      })

      test('should create a new employee', async () => {
        const res = await
        request(app)
          .post('/employed')
          .set('Cookie', cookie)
          .send({ name: 'testEmployee', username_id: testEmployeeID, password: 'testPassword' })
        expect(res.header['content-type']).toMatch('json')
        expect(res.body.password).toBeUndefined()
        expect(res.body.name).toBe('testEmployee')
      })

      test('should update newly created employee', async () => {
        const res = await
        request(app)
          .put('/employed/' + testEmployeeID)
          .set('Cookie', cookie)
          .send({ name: 'updateEmployee' })
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

      beforeAll(async () => {
        // search for the first vehicle, get the string version of the _id
        vehicle = await VehicleModel.findOne()
        vehicleIDString = vehicle._id.toString()
        // Get the latest log of the queried vehicle so a recent odometer is obtained
        const lastLog = await LogModel.find({ vehicle_id: vehicle._id }).sort({ current_odo: -1 })
        latestVehicleOdometer = lastLog[0].current_odo
        // Login as employee and set cookie
        const login = await
        request(app)
          .get('/auth/login')
          .auth('10002', 'johnSmith')
        cookie = login.headers['set-cookie']
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

      test('should be able to remove the newly created log (Employer access)', async () => {
        // login as admin/employee
        const login = await
          request(app)
            .get('/auth/login')
            .auth('10001', 'test password')
          cookie = login.headers['set-cookie']
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

    })
  })

  describe('Log routes', () => {
    describe('Employer routes', () => {

    })
  })

  describe('Vechicle routes', () => {
    describe('Employer routes', () => {

    })
  })

  describe('Log Review routes', () => {
    describe('Employer routes', () => {

    })
  })

  describe('Analytical routes', () => {
    describe('Employer routes', () => {

    })
  })
})
