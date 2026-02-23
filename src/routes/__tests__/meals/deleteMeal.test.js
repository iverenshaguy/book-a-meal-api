import request from 'supertest';

import app from 'src/app';
import invalidID from 'src/utils/test-utils/invalidID';
import notAdmin from 'src/utils/test-utils/notAdmin';
import notFound from 'src/utils/test-utils/notFound';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';

const { foodCircleToken } = tokens;

describe('Meal Routes: Delete a meal option', () => {
  it('should delete a meal for authenticated user', (done) => {
    request(app)
      .delete('/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Meal deleted successfully');

        if (err) return done(err);
        done();
      });
  });

  it('should not get a meal that was originally deleted', (done) => {
    request(app)
      .get('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        const mealExists = !!res.body.meals.find(
          (meal) => meal.id === '91b6e41c-0972-4ac5-86da-4ac1f5226e83',
        );

        expect(mealExists).toBe(false);

        if (err) return done(err);
        done();
      });
  });

  invalidID({
    type: 'mealId',
    method: 'delete',
    url: '/meals/efbbf4ad-c4ae-4134-928d-b5ee305ed5396478',
    token: foodCircleToken,
  });

  notFound({
    method: 'delete',
    url: '/meals/efbbf4ad-c4ae-4134-928d-b5ee305ed539',
    token: foodCircleToken,
  });

  notAdmin('delete', '/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83');

  unAuthorized('delete', '/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83');
});
