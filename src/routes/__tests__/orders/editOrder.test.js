import app from 'src/app';
import db from 'src/models';
import invalidID from 'src/utils/test-utils/invalidID';
import { order } from 'src/utils/test-utils/mockData';
import notFound from 'src/utils/test-utils/notFound';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';
import request from 'supertest';

const { jidennaToken } = tokens;

const { newOrderDetails, badOrderDetails } = order;

let newMenuId;
let newOrderId;

describe('Order Routes: Modify an Order', () => {
  beforeAll((done) => {
    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send(newOrderDetails)
      .end((err, res) => {
        newOrderId = res.body.id;
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');

        if (err) return done(err);
        done();
      });
  });

  it('should modify an order for authenticated user with meals', (done) => {
    request(app)
      .put(`/orders/${newOrderId}`)
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({
        ...newOrderDetails,
        meals: [
          { mealId: 'baa0412a-d167-4d2b-b1d8-404cb8f02631', quantity: 1 },
        ],
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.meals.length).toBe(1);
        expect(res.body.meals[0].id).toBe(
          'baa0412a-d167-4d2b-b1d8-404cb8f02631',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should modify an order for authenticated user without meals', (done) => {
    request(app)
      .put(`/orders/${newOrderId}`)
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({ deliveryAddress: '5, Abakaliki Street, Lagos' })
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.deliveryAddress).toBe('5, Abakaliki Street, Lagos');

        if (err) return done(err);
        done();
      });
  });

  it('should not modify user details for an order that is being canceled', (done) => {
    request(app)
      .put(`/orders/${newOrderId}`)
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({ deliveryPhoneNo: '08134567891', status: 'canceled' })
      .end((err, res) => {
        db.User.findOne({ where: { phoneNo: '08134567891' } }).then((user) => {
          expect(user).toBeNull();
          expect(res.body.status).toBe('canceled');

          if (err) return done(err);
          done();
        });
      });
  });

  it('should not modify an expired order', (done) => {
    request(app)
      .put('/orders/fb097bde-5959-45ff-8e21-51184fa60c25')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send(newOrderDetails)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Order is expired');

        if (err) return done(err);
        done();
      });
  });

  it('should not modify a pending order', (done) => {
    db.Order.findOne({
      where: { orderId: 'fb097bde-5959-45ff-8e21-51184fa60c25' },
    }).then((foundOrder) => foundOrder.update({ status: 'pending' }).then(() => {
      request(app)
        .put('/orders/fb097bde-5959-45ff-8e21-51184fa60c25')
        .set('Accept', 'application/json')
        .set('authorization', jidennaToken)
        .send(newOrderDetails)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toBe(
            'Order is being processed and cannot be edited',
          );

          if (err) return done(err);
          done();
        });
    }),);
  });

  it('should not modify a canceled order', (done) => {
    db.Order.findOne({
      where: { orderId: 'fb097bde-5959-45ff-8e21-51184fa60c25' },
    }).then((foundOrder) => foundOrder.update({ status: 'canceled' }).then(() => {
      request(app)
        .put('/orders/fb097bde-5959-45ff-8e21-51184fa60c25')
        .set('Accept', 'application/json')
        .set('authorization', jidennaToken)
        .send(newOrderDetails)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body.error).toBe('Order has been canceled');

          if (err) return done(err);
          done();
        });
    }),);
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .put(`/orders/${newOrderId}`)
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({ ...badOrderDetails, date: '' })
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.deliveryAddress.msg).toBe(
          'If provided, delivery address field cannot be left blank',
        );
        expect(res.body.errors.deliveryPhoneNo.msg).toBe(
          'Delivery Phone Number must be in the format 080xxxxxxxx',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return error for empty request', (done) => {
    request(app)
      .put(`/orders/${newOrderId}`)
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send()
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Empty PUT Requests Are Not Allowed');

        if (err) return done(err);
        done();
      });
  });

  invalidID({
    type: 'orderId',
    method: 'put',
    url: '/orders/efbbf4ad-c4ae-4134-928d-b5ee305ed5396478',
    token: jidennaToken,
    data: { ...newOrderDetails, menuId: newMenuId },
  });

  notFound({
    method: 'put',
    url: '/orders/9ce447be-ee46-424e-82b8-ae4160e795b4',
    token: jidennaToken,
    data: {
      ...newOrderDetails,
      menuId: '8356954a-9a42-4616-8079-887a73455a7f',
    },
  });

  unAuthorized('put', '/orders/e544248c-145c-4145-b165-239658857637');
});
