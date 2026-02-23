import request from 'supertest'; // eslint-disable-line

import app from 'src/app';

/**
 * @function unAuthorized
 * @desc Funtion to test authorized routes
 * @param {string} method
 * @param {string} url
 * @returns {function} Returns Jest test helper
 */

const unAuthorized = (method, url) => {
  describe('unAuthorized', () => {
    it('should return 401 error for user without token', (done) => {
      request(app)[method](url)
        .set('Accept', 'application/json')
        .end((err, res) => {
          expect(res.statusCode).toBe(401);
          expect(res.body.error).toBe('Unauthorized');

          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
};

export default unAuthorized;
