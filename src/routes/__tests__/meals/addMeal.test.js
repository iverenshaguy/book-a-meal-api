import request from 'supertest';

import app from 'src/app';
import { addMeal as mockData } from 'src/utils/test-utils/mockData';
import notAdmin from 'src/utils/test-utils/notAdmin';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';

const { foodCircleToken } = tokens;
const { newMealDetails, invalidMealDetails } = mockData;

describe('Meal Routes: Add a meal option', () => {
  it('should add a meal for authenticated user', (done) => {
    request(app)
      .post('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...newMealDetails, title: 'Oriental Fried Rice' })
      .end((err, res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Oriental Fried Rice');

        if (err) return done(err);
        done();
      });
  });

  it('should not add an existing meal for authenticated user', (done) => {
    request(app)
      .post('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...newMealDetails, title: 'Oriental Fried Rice' })
      .end((err, res) => {
        expect(res.statusCode).toBe(409);
        expect(res.body.error).toBe('Meal already exists');

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .post('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send(invalidMealDetails)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.title.msg).toBe(
          'Meal title field cannot be left blank',
        );
        expect(res.body.errors.description.msg).toBe(
          "Text can only contain letters and the characters (,.'-)",
        );
        expect(res.body.errors.price.msg).toBe(
          'Price field cannot be left blank',
        );
        expect(res.body.errors.vegetarian.msg).toBe(
          'Accepts only true or false',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid price, 0', (done) => {
    request(app)
      .post('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...invalidMealDetails, price: 0 })
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.price.msg).toBe(
          'Price must be greater than 0',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid price, -25', (done) => {
    request(app)
      .post('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...invalidMealDetails, price: -25 })
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.price.msg).toBe(
          'Price must be greater than 0',
        );

        if (err) return done(err);
        done();
      });
  });

  notAdmin('post', '/meals');

  unAuthorized('post', '/meals');
});
