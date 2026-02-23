import request from 'supertest';

import app from 'src/app';
import db from 'src/models';

describe('Password Routes', () => {
  describe('Forgot Password', () => {
    it('should send reset password mail', (done) => {
      request.agent(app)
        .post('/auth/forgot_password')
        .send({ email: 'jidenna@emodi.com' })
        .end((err, res) => {
          expect(res.statusCode).toBe(200);
          expect(res.body.message).toBe('A reset token has been sent to your email address');

          if (err) return done(err);
          done();
        });
    });

    it('should not send reset password mail to none existing user', (done) => {
      request.agent(app)
        .post('/auth/forgot_password')
        .send({ email: 'non@existing.com' })
        .end((err, res) => {
          expect(res.statusCode).toBe(404);
          expect(res.body.error).toBe('This user is not registered on the platform, please signup instead');

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for invalid email', (done) => {
      request.agent(app)
        .post('/auth/forgot_password')
        .send({ email: 'emi@ola' })
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.email.msg).toBe('Email is invalid');

          if (err) return done(err);
          done();
        });
    });
  });
  describe('Reset Password', () => {
    it('should reset password and sends reset password successful mail', (done) => {
      db.User.findOne({ where: { email: 'jidenna@emodi.com' } }).then((user) => {
        request.agent(app)
          .post(`/auth/reset_password?token=${user.passwordResetToken}`)
          .send({ password: 'jidennaemodi2' })
          .end((err, res) => {
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Password reset successful');

            if (err) return done(err);
            done();
          });
      });
    });

    it('should not reset password for invalid/expired token', (done) => {
      db.User.findOne({ where: { email: 'jidenna@emodi.com' } }).then((user) => {
        request.agent(app)
          .post(`/auth/reset_password?token=${user.passwordResetToken}`)
          .send({ password: 'jidennaemodi2' })
          .end((err, res) => {
            expect(res.statusCode).toBe(400);
            expect(res.body.error).toBe('Password reset token is invalid or has expired');

            if (err) return done(err);
            done();
          });
      });
    });

    it('should return validation errors when no password is provided', (done) => {
      request.agent(app)
        .post('/auth/reset_password')
        .send({ password: '' })
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.password.msg).toBe('Password field cannot be left blank');

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for invalid password', (done) => {
      request.agent(app)
        .post('/auth/reset_password')
        .send({ password: 'emi' })
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.password.msg).toBe('Password must be at least 8 characters');

          if (err) return done(err);
          done();
        });
    });
  });
});
