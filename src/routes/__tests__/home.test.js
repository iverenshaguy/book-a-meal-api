import request from 'supertest';

import app from 'src/app';

describe('API Home Routes', () => {
  it('should serve HTML documentation at root', (done) => {
    request(app)
      .get('/')
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/html/);

        if (err) return done(err);
        done();
      });
  });

  it('should return a 404 JSON response for unknown routes', (done) => {
    request(app)
      .get('/unknown-route')
      .expect('Content-Type', /json/)
      .end((err, res) => {
        expect(res.statusCode).toBe(404);
        expect(res.body.error).toBe('Item Not Found');

        if (err) return done(err);
        done();
      });
  });
});
