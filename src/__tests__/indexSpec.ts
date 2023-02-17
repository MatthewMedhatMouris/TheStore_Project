import supertest from 'supertest';
import app from '../index';

const request = supertest(app);

describe('Test Server Endpoint Responses', () => {
  it('Successfully EndPoint', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });
});
