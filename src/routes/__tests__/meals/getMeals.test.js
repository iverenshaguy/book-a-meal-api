import app from 'src/app';
import notAdmin from 'src/utils/test-utils/notAdmin';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';
import request from 'supertest';

const { foodCircleToken } = tokens;

describe('Meal Routes: Get all meals', () => {
  it('should get all meals for authenticated user', (done) => {
    request(app)
      .get('/meals')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.meals.length).toBe(8);

        if (err) return done(err);
        done();
      });
  });

  it('should get limited meals for authenticated user with metadata when query is passed in', (done) => {
    request(app)
      .get('/meals?limit=2&page=3')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.meals.length).toBe(2);

        if (err) return done(err);
        done();
      });
  });

  it('should get only meals containing searchTerm for authenticated user with metadata when search query is passed in', (done) => {
    request(app)
      .get('/meals?search=Rice')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.meals.length).toBe(1);
        expect(res.body.meals[0].title).toBe('Jollof Rice, Beef and Plantain');

        if (err) return done(err);
        done();
      });
  });

  describe('Bad Query', () => {
    it('should return errors for bad page and limit query', (done) => {
      request(app)
        .get('/meals?page=undefined&limit=ghjkl')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors.limit.msg).toBe(
            'Limit must be an integer greater than 0',
          );
          expect(res.body.errors.page.msg).toBe(
            'Page must be an integer greater than 0',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return errors for null/0 page and limit query', (done) => {
      request(app)
        .get('/meals?page=null&limit=0')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors.limit.msg).toBe(
            'Limit must be an integer greater than 0',
          );
          expect(res.body.errors.page.msg).toBe(
            'Page must be an integer greater than 0',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return errors for empty page and limit query', (done) => {
      request(app)
        .get('/meals?page=&limit=')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toHaveProperty('errors');
          expect(res.body.errors.limit.msg).toBe('Limit cannot be blank');
          expect(res.body.errors.page.msg).toBe('Page cannot be blank');

          if (err) return done(err);
          done();
        });
    });
  });

  notAdmin('get', '/meals');

  unAuthorized('get', '/meals');
});
