import app from 'src/app';
import db from 'src/models';
import { order as mockData } from 'src/utils/test-utils/mockData';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';
import request from 'supertest';

const { foodCircleToken, emiolaToken, fakeUserToken } = tokens;
const { newOrderDetails } = mockData;

describe('Order Routes: Get All Orders', () => {
  beforeAll((done) => {
    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', emiolaToken)
      .send({ ...newOrderDetails })
      .end((err, res) => {
        db.Order.findOne({ where: { orderId: res.body.id } }).then((order) =>
          order.update({ status: 'pending' }).then(() => {
            expect(res.statusCode).toBe(201);

            if (err) return done(err);
            done();
          }),
        );
      });
  });

  describe('Get Caterer Orders', () => {
    it("should get all caterer's orders", (done) => {
      request(app)
        .get('/orders')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.orders.length).toBe(7);

          if (err) return done(err);
          done();
        });
    });

    it("should get all caterer's orders for a particular day", (done) => {
      request(app)
        .get('/orders?date=2018-05-01')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.orders.length).toBe(1);

          if (err) return done(err);
          done();
        });
    });

    it("should get empty caterer's orders for a particular day when no orders exist", (done) => {
      request(app)
        .get('/orders?date=2018-01-06')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.orders.length).toBe(0);

          if (err) return done(err);
          done();
        });
    });

    it('should get single order for caterer', (done) => {
      request(app)
        .get('/orders/ce228787-f939-40a0-bfd3-6607ca8d2e53')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.id).toBe('ce228787-f939-40a0-bfd3-6607ca8d2e53');
          expect(res.body.status).toBe('delivered');

          if (err) return done(err);
          done();
        });
    });

    it("should return error if order doesn't exist for the caterer", (done) => {
      request(app)
        .get('/orders/fb097bde-5959-45ff-8e21-51184fa60c22')
        .set('Accept', 'application/json')
        .set('authorization', foodCircleToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.error).toBe('Item Not Found');

          if (err) return done(err);
          done();
        });
    });

    it('should not get orders for unauthorized user', (done) => {
      request(app)
        .get('/orders')
        .set('Accept', 'application/json')
        .set('authorization', fakeUserToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(401);
          expect(res.body.error).toBe('Unauthorized');

          if (err) return done(err);
          done();
        });
    });

    describe('Bad Query', () => {
      it('should return errors for bad page and limit query', (done) => {
        request(app)
          .get('/orders?date=2018-08-02&page=undefined&limit=ghjkl')
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
          .get('/orders?date=2018-08-02&page=null&limit=0')
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
          .get('/orders?date=2018-08-02&page=&limit=')
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

    unAuthorized('get', '/orders');
  });

  describe('Get Customer Orders', () => {
    it('should get all orders in the app for customer', (done) => {
      request(app)
        .get('/orders')
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.orders.length).toBe(4);

          if (err) return done(err);
          done();
        });
    });

    it('should get customers orders in the app for a particular day', (done) => {
      request(app)
        .get('/orders?date=2018-04-06')
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.orders.length).toBe(1);
          expect(res.body.orders[0].id).toBe(
            'fb097bde-5959-45ff-8e21-51184fa60c25',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should get single order for customer', (done) => {
      request(app)
        .get('/orders/fb097bde-5959-45ff-8e21-51184fa60c25')
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.id).toBe('fb097bde-5959-45ff-8e21-51184fa60c25');
          expect(res.body.status).toBe('delivered');

          if (err) return done(err);
          done();
        });
    });

    it("should return error if order doesn't exist for the customer", (done) => {
      request(app)
        .get('/orders/fb097bde-5959-45ff-8e21-51184fa60c22')
        .set('Accept', 'application/json')
        .set('authorization', emiolaToken)
        .end((err, res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.error).toBe('Item Not Found');

          if (err) return done(err);
          done();
        });
    });

    unAuthorized('get', '/orders');
  });
});
