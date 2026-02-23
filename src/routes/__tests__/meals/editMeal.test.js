import app from 'src/app';
import invalidID from 'src/utils/test-utils/invalidID';
import invalidPUT from 'src/utils/test-utils/invalidPUT';
import { editMeal as mockData } from 'src/utils/test-utils/mockData';
import notAdmin from 'src/utils/test-utils/notAdmin';
import notFound from 'src/utils/test-utils/notFound';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';
import request from 'supertest';

const { foodCircleToken } = tokens;
const { updatedMealDetails, invalidMealDetails } = mockData;

describe('Meal Routes: Edit a meal option', () => {
  it('should edit a meal for authenticated user', (done) => {
    request(app)
      .put('/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({
        ...updatedMealDetails,
        title: 'Plantain and Egg',
        price: undefined,
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe('91b6e41c-0972-4ac5-86da-4ac1f5226e83');

        if (err) return done(err);
        done();
      });
  });

  it('should edit a meal and parse meal price for authenticated user', (done) => {
    request(app)
      .put('/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...updatedMealDetails, price: '1499.99' })
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.id).toBe('91b6e41c-0972-4ac5-86da-4ac1f5226e83');

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .put('/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send(invalidMealDetails)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.title.msg).toBe(
          'If provided, meal title field cannot be left blank',
        );
        expect(res.body.errors.description.msg).toBe(
          "Text can only contain letters and the characters (,.'-)",
        );
        expect(res.body.errors.price.msg).toBe(
          'Price must be a number or decimal',
        );
        expect(res.body.errors.vegetarian.msg).toBe(
          'Accepts only true or false',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return error for existent meal title', (done) => {
    process.env.EXPIRY = 5000;

    request(app)
      .put('/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({
        ...updatedMealDetails,
        title: 'Vegetable Sharwama and Guava Smoothie',
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe('Meal already exists');

        if (err) return done(err);
        done();
      });
  });

  invalidID({
    type: 'mealId',
    method: 'put',
    url: '/meals/efbbf4ad-c4ae-4134-928d-b5ee305ed5396478',
    token: foodCircleToken,
    data: updatedMealDetails,
  });

  invalidPUT(
    '/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83',
    foodCircleToken,
  );

  notFound({
    method: 'put',
    url: '/meals/efbbf4ad-c4ae-4134-928d-b5ee305ed539',
    token: foodCircleToken,
    data: { ...updatedMealDetails, title: 'Porridge' },
  });

  notAdmin('put', '/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83');

  unAuthorized('put', '/meals/91b6e41c-0972-4ac5-86da-4ac1f5226e83');
});
