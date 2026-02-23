import app from 'src/app';
import { tokens } from 'src/utils/test-utils/setup';
import request from 'supertest';

const { foodCircleToken, emiolaToken } = tokens;

describe('Notifications: Get Notifications', () => {
  it("should get all caterer's notifications", (done) => {
    request(app)
      .get('/notifications')
      .set('Accept', 'application/json')
      .set('authorization', foodCircleToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.notifications.length).toBe(1);
        expect(res.body.notifications[0].message).toBe(
          'Your menu was just ordered',
        );

        if (err) return done(err);
        done();
      });
  });

  it("should get all customers's notifications", (done) => {
    request(app)
      .get('/notifications')
      .set('Accept', 'application/json')
      .set('authorization', emiolaToken)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body.notifications.length).toBe(3);
        expect(res.body.notifications[0].message).toBe(
          'Vegetable Sharwama and Guava Smoothie was just added to the menu',
        );
        expect(res.body.notifications[1].message).toBe(
          'Jollof Spaghetti, Plantain and Turkey was just added to the menu',
        );
        expect(res.body.notifications[2].message).toBe(
          'Semo and Egusi Soup was just added to the menu',
        );

        if (err) return done(err);
        done();
      });
  });
});
