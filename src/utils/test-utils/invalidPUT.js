import request from 'supertest'; // eslint-disable-line

import app from 'src/app';

/**
 * @function invalidPUT
 * @desc Funtion to test for empty PUT requests
 * @param {string} url
 * @param {string} token
 * @returns {function} Returns Jest test helper
 */
const invalidPUT = (url, token) => {
  describe('invalidPUT', () => {
    it('should return 400 error for empty object', (done) => {
      request(app)
        .put(url)
        .set('Accept', 'application/json')
        .set('authorization', token)
        .send({})
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toBe('Empty PUT Requests Are Not Allowed');

          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
};

export default invalidPUT;
