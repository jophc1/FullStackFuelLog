import app from './app'
import request from 'supertest'
import { authAccess, verifyAdmin } from './middleware/auth_mw.js'

describe('App Tests', () => {
  describe('Authentication', () => {

    test('should authenticate admin user when making a request to GET /login', async () => {
      const res = await 
        request(app)
          .get('/login')
          .auth('10001', 'test password')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Login successful')
    })

    test('should return no auth data in request when no auth header is sent', async () => {
      const res = await 
        request(app)
          .get('/login')
      expect(res.status).toBe(500)
      expect(res.body.authError).toMatch('No auth')
    })

    test('should return error message with incorrect auth details', async () => {
      const res = await
        request(app)
          .get('/login')
          .auth('10001', 'random')
      expect(res.status).toBe(500)
      expect(res.body.authError).toMatch('Invalid')
    })

    test('should save cookies with the access token', async () => {
      const res = await
        request(app)
          .get('/login')
          .auth('10001', 'test password')
          .expect('set-cookie', /accessToken/)
    })
  })

  describe('Authorisation', () => {

    test('should prevent access of Employer routes', async () => {
      const login = await
        request(app)
          .get('/login')
          .auth('10002', 'johnSmith')

      const cookie = login.headers['set-cookie']

      const res = await
        request(app)
          .get('/employed')
          .set( "Cookie", cookie)
        expect(res.body.authError).toMatch("Unauth")
      // expect(authAccess()).toHaveBeenCalledTimes(1)
    })
  })

  describe('User routes', () => {

    describe('Employer routes', () => {
      let cookie
      let testEmployeeID = 99999

        beforeAll(async () => {
          const login = await
            request(app)
              .get('/login')
              .auth('10001', 'test password')

          cookie = login.headers['set-cookie']
        })

      test('should create a new employee', async () => {
        const res = await
          request(app)
            .post('/employed')
            .set("Cookie", cookie)
            .send( { name: "testEmployee", username_id: testEmployeeID, password: "testPassword" } )
            expect(res.header['content-type']).toMatch('json')
          expect(res.body.password).toBeUndefined()
          expect(res.body.name).toBe("testEmployee")
      })

      test('should update newly created employee', async () => {
        const res = await
          request(app)
            .put('/employed/' + testEmployeeID)
            .set("Cookie", cookie)
            .send( { name: "updateEmployee"})
          expect(res.body.modifiedCount).toBe(1)

      })

      test('should delete the newly created employee', async () => {
        const res = await
          request(app)
            .delete('/employed/' + testEmployeeID)
            .set("Cookie", cookie)
          expect(res.body.deletedCount).toBe(1)
      })
    
    })
    // describe('Employee routes', () => {
    
    
    // })
    
  })
  
})