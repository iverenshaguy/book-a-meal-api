import app from 'src/app';
import db from 'src/models';
import {
  currentDay,
  menu as mockData,
  twoDaysTime,
} from 'src/utils/test-utils/mockData';
import { tokens } from 'src/utils/test-utils/setup';
import request from 'supertest';

const { foodCircleToken, jidennaToken } = tokens;
const { menuDetailsWithoutDate } = mockData;

describe('Menu Routes: Get the menu specific day', () => {
  beforeAll((done) => {
    request(app)
      .post('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .send({ ...menuDetailsWithoutDate, date: twoDaysTime })
      .end((err, res) => {
        expect(res.statusCode).toBe(201);

        if (err) return done(err);
        done();
      });
  });

  it('should get menu for the current day for customer', (done) => {
    request(app)
      .get('/menu')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('menu');

        if (err) return done(err);
        done();
      });
  });

  it('should get only meals containing searchTerm in menu for customer with metadata when search query is passed in', (done) => {
    request(app)
      .get('/menu?search=fish')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.menu.meals.length).toBe(1);
        expect(res.body.menu.meals[0].title).toContain('Fish');

        if (err) return done(err);
        done();
      });
  });

  it('should get menu for the current day for caterer', (done) => {
    request(app)
      .get('/menu')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('metadata');
        expect(res.body.menu).toHaveProperty('id');
        expect(res.body.menu).toHaveProperty('date');
        expect(res.body.menu.date).toBe(currentDay);

        if (err) return done(err);
        done();
      });
  });

  it('should append date to query when getting next meals url for caterer when query contains date', (done) => {
    request(app)
      .get('/menu?date=2018-03-09&limit=2')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('metadata');
        expect(res.body.metadata.next).toBe(
          '/menu?date=2018-03-09&page=2&limit=2',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should not append date to query when getting next meals url for caterer when query does not contains date', (done) => {
    request(app)
      .get('/menu?limit=2')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('metadata');
        expect(res.body.metadata.next).toBe('/menu?page=2&limit=2');

        if (err) return done(err);
        done();
      });
  });

  it('should get menu for a specific day for caterer', (done) => {
    request(app)
      .get(`/menu?date=${twoDaysTime}`)
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('metadata');
        expect(res.body.menu).toHaveProperty('id');
        expect(res.body.menu).toHaveProperty('date');
        expect(res.body.menu.date).toBe(twoDaysTime);

        if (err) return done(err);
        done();
      });
  });

  describe('No Menu', () => {
    beforeAll((done) => {
      db.Menu.destroy({ truncate: { cascade: true } }).then(() => done());
    });

    it('should return empty meals array when there is no menu for customer', (done) => {
      request(app)
        .get('/menu')
        .set('Accept', 'application/json')
        .set('authorization', jidennaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.menu.meals.length).toBe(0);

          if (err) return done(err);
          done();
        });
    });

    it('should return empty meals when there is no menu for user', (done) => {
      request(app)
        .get('/menu')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.menu.meals.length).toBe(0);

          if (err) return done(err);
          done();
        });
    });
  });

  describe('Bad Query', () => {
    it('should return errors for bad page and limit query', (done) => {
      request(app)
        .get('/menu?date=2018-08-02&page=undefined&limit=ghjkl')
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
        .get('/menu?date=2018-08-02&page=null&limit=0')
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
        .get('/menu?date=2018-08-02&page=&limit=')
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
});
