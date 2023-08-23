import app from './app'
import request from 'supertest'

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
    
  })
  
})