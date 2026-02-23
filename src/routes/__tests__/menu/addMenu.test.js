import request from 'supertest';

import app from 'src/app';
import {
  currentDay,
  menu as mockData,
  tomorrow,
} from 'src/utils/test-utils/mockData';
import notAdmin from 'src/utils/test-utils/notAdmin';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';

const { foodCircleToken, bellyFillToken } = tokens;
const { menuDetailsWithoutDate, menuDetailsWithDate, menuDetailsWithBadDate } = mockData;

describe('Menu Routes: Add a new menu', () => {
  it('should add a menu for authenticated user, for the next day', (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...menuDetailsWithoutDate, date: tomorrow })
      .end((err, res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('date');
        expect(res.body.date).toBe(tomorrow);
        expect(res.body.meals[0].id).toBe(
          'baa0412a-d167-4d2b-b1d8-404cb8f02631',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should add a menu for authenticated user, for the current day', (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', bellyFillToken)
      .send({ meals: ['46ced7aa-eed5-4462-b2c0-153f31589bdd'] })
      .end((err, res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('date');
        expect(res.body.date).toBe(currentDay);
        expect(res.body.meals[0].id).toBe(
          '46ced7aa-eed5-4462-b2c0-153f31589bdd',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should not add a menu for authenticated user, for the current day again', (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send(menuDetailsWithoutDate)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Menu already exists for this day');

        if (err) return done(err);
        done();
      });
  });

  it('should not add menu for earlier date', (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send(menuDetailsWithDate)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.date.msg).toBe(
          'Date must be either today or in the future',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send(menuDetailsWithBadDate)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.date.msg).toBe(
          'Date is invalid, valid format is YYYY-MM-DD',
        );
        expect(res.body.errors.meals.msg).toBe(
          ' MealId 72a3417e-45c8-4559ie-8b74-8b5a61be8614 is invalid, MealId 8a65538d-f862-420e78-bcdc-80743df06578 is invalid, MealId f9eb7652-125a-4bcbuu-ad81-02f84901cdc3 is invalid',
        );

        if (err) return done(err);
        done();
      });
  });

  it("should not add meal that's not for user", (done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({
        ...menuDetailsWithoutDate,
        date: '2019-05-04',
        meals: ['46ced7aa-eed5-4462-b2c0-153f31589bdd'],
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.meals.msg).toBe(
          "You don't have access to Meal 46ced7aa-eed5-4462-b2c0-153f31589bdd",
        );

        if (err) return done(err);
        done();
      });
  });

  notAdmin('post', '/meals');

  unAuthorized('post', '/meals');
});
