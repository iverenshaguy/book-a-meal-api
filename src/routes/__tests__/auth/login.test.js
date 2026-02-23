import request from 'supertest';

import app from 'src/app';
import { login as loginDetails } from 'src/utils/test-utils/mockData';

const { existingUser, nonExistingUser, invalidUser } = loginDetails;

describe('Signin Routes', () => {
  it('should sign in a user into the app and returns user + token', (done) => {
    request
      .agent(app)
      .post('/auth/signin')
      .send(existingUser)
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.firstname).toBe('Iveren');
        expect(res.body.user.email).toBe('iveren@shaguy.com');

        if (err) return done(err);
        done();
      });
  });

  it('should sign in a caterer into the app and returns user + token', (done) => {
    request
      .agent(app)
      .post('/auth/signin')
      .send({ email: 'belly@fill.com', password: 'bellyfill' })
      .end((err, res) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body).toHaveProperty('token');
        expect(res.body.user.businessName).toBe('BellyFill');
        expect(res.body.user.email).toBe('belly@fill.com');

        if (err) return done(err);
        done();
      });
  });

  it('should not sign in a user that does not exist', (done) => {
    request
      .agent(app)
      .post('/auth/signin')
      .send(nonExistingUser)
      .end((err, res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.error).toBe('Invalid Credentials');

        if (err) return done(err);
        done();
      });
  });

  it('should not sign in an user existing user with a wrong password', (done) => {
    request
      .agent(app)
      .post('/auth/signin')
      .send({ ...existingUser, password: 'kowo' })
      .end((err, res) => {
        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.error).toBe('Invalid Credentials');

        if (err) return done(err);
        done();
      });
  });

  it('should return validation errors for wrong input', (done) => {
    request
      .agent(app)
      .post('/auth/signin')
      .send(invalidUser)
      .end((err, res) => {
        expect(res.statusCode).toBe(400);
        expect(res.body).toEqual(expect.any(Object));
        expect(res.body.errors.email.msg).toBe('Email is invalid');
        expect(res.body.errors.password.msg).toBe(
          'Password must be specified',
        );

        if (err) return done(err);
        done();
      });
  });
});
