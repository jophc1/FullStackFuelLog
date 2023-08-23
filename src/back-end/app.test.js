import app from './app'
import request from 'supertest'

describe('App Tests', () => {
  describe('Authentication', () => {

    test('GET /login', async () => {
      const res = await 
        request(app)
          .get('/login')
          .auth('10001', 'test password')
      expect(res.status).toBe(200)
      expect(res.body.message).toBe('Login successful')
    })

    test('no auth returns no auth data in request', async () => {
      const res = await 
        request(app)
          .get('/login')
      expect(res.status).toBe(500)
      expect(res.body.authError).toMatch('No auth')
    })

    test('incorrect auth details', async () => {
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
  
})