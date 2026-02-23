import request from 'supertest'; // eslint-disable-line

import app from 'src/app'; // eslint-disable-line
import { tokens } from './setup';

const { emiolaToken } = tokens;

/**
 * @function notAdmin
 * @desc Funtion to test forbidden routes
 * @param {string} method
 * @param {string} url
 * @returns {function} Returns Jest test helper
 */
const notAdmin = (method, url) => {
  describe('User is not Admin or Caterer', () => {
    it('should return 403 error for authorized user ie non admin or caterer', (done) => {
      request(app)[method](url)
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(403);
          expect(res.body.error).toBe(
            'You are not authorized to perform this action',
          );

          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
};

export default notAdmin;
