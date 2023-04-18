import app from '../app';
import request from 'supertest';

// group test using describe
describe('GET /', () => {
  it('returns status code 200 if the endpoint is called', async () => {
    const res = await request(app)
      .get('/')
      .send();
    // toEqual recursively checks every field of an object or array.
    expect(res.statusCode).toEqual(200);
  });
});