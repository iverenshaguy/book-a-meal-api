import request from 'supertest';

import app from 'src/app';
import { tokens } from 'src/utils/test-utils/setup';

const { emiolaToken } = tokens;

describe('Refresh Token', () => {
  it('should refresh user token based on token input', (done) => {
    request
      .agent(app)
      .get('/auth/refresh_token')
      .set('Accept', 'application/json')
      .set('authorization', emiolaToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.user.firstname).toBe('Emiola');
        expect(res.body).toHaveProperty('token');

        if (err) {
          return done(err);
        }
        done();
      });
  });
});
