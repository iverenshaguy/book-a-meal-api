import request from 'supertest';

import app from 'src/app';
import { tokens } from 'src/utils/test-utils/setup';

const { jidennaToken } = tokens;

describe('Refresh Token', () => {
  it('should refresh user token based on token input', (done) => {
    request
      .agent(app)
      .get('/auth/refresh_token')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.user.firstname).toBe('Jidenna');
        expect(res.body).toHaveProperty('token');

        if (err) {
          return done(err);
        }
        done();
      });
  });
});
