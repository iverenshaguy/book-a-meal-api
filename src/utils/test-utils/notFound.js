import request from 'supertest'; // eslint-disable-line

import app from 'src/app';

/**
 * @function notFound
 * @desc Funtion to test forbidden routes
 * @param {object} params
 * @returns {function} Returns Jest test helper
 */
const notFound = ({
  method, url, token, data
}) => {
  describe('notFound', () => {
    it('should return 404 error for non-existent item', (done) => {
      request(app)[method](url)
        .set('Accept', 'application/json')
        .set('authorization', token)
        .send(data)
        .end((err, res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.error).toBe('Item Not Found');

          if (err) {
            return done(err);
          }
          done();
        });
    });
  });
};

export default notFound;
