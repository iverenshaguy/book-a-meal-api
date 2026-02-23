import mockDate from 'mockdate';
import app from 'src/app';
import moment from 'src/utils/moment';
import { order as mockData } from 'src/utils/test-utils/mockData';
import { tokens } from 'src/utils/test-utils/setup';
import unAuthorized from 'src/utils/test-utils/unAuthorized';
import request from 'supertest';

const { jidennaToken } = tokens;

const { badOrderDetails, newOrderDetails } = mockData;

const currentDay = moment().format('YYYY-MM-DD');

describe('Order Routes: Add an Order', () => {
  it('should add an order for an authenticated user', (done) => {
    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({ ...newOrderDetails })
      .end((err, res) => {
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.meals.length).toBe(2);
        expect(res.body.meals[0].quantity).toBe(2);
        expect(res.body.meals[0]).toHaveProperty('price');

        if (err) return done(err);
        done();
      });
  });

  it('should not add an order when office is closed', (done) => {
    const FIXED_TEST_DATE = moment(
      `${currentDay} 18:00:00`,
      'YYYY-MM-DD HH:mm:ss',
    ).valueOf();
    mockDate.set(FIXED_TEST_DATE);

    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send(newOrderDetails)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe(
          'Meals can only be ordered from 8:30am to 4:00pm',
        );

        if (err) return done(err);
        done();
      });
  });

  it("should not add an order when meal isn't in menu for the day", (done) => {
    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send({
        meals: [
          { mealId: '46ced7aa-eed5-4462-b2c0-153f31589bdd', quantity: 1 },
        ],
      })
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body.errors.meals.msg).toBe(
          'Meal 46ced7aa-eed5-4462-b2c0-153f31589bdd is not available',
        );

        if (err) return done(err);
        done();
      });
  });

  it('should return errors for invalid input', (done) => {
    request(app)
      .post('/orders')
      .set('Accept', 'application/json')
      .set('authorization', jidennaToken)
      .send(badOrderDetails)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.status.msg).toBe(
          'Status should not be provided',
        );
        expect(res.body.errors.meals.msg).toBe('Meals must be specified');
        expect(res.body.errors.deliveryAddress.msg).toBe(
          'Delivery Address field cannot be left blank',
        );
        expect(res.body.errors.deliveryPhoneNo.msg).toBe(
          'Delivery Phone Number must be in the format 080xxxxxxxx',
        );

        if (err) return done(err);
        done();
      });
  });

  unAuthorized('post', '/orders');
});
