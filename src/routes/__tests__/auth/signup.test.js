import request from 'supertest';

import app from 'src/app';
import { signup as signupDetails } from 'src/utils/test-utils/mockData';

const {
  rightUserDetails,
  rightCatererDetails,
  wrongUserDetails,
  wrongCatererDetails,
  wrongRoleUserDetails,
  wrongLengthCatererDetails,
  invalidCatererDetails,
  longName,
} = signupDetails;

// let userToken;

describe('Signup Routes', () => {
  describe('User Signup', () => {
    it('should register a new user and returns user data + token for valid data', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(rightUserDetails)
        .end((err, res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body).toHaveProperty('token');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('favour@shaguy.com');

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for wrong input', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(wrongUserDetails)
        .end((err, res) => {
          // userToken = res.body.token;
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.businessName.msg).toBe('Unaccepted Field');
          expect(res.body.errors.firstname.msg).toBe(
            'Firstname must be specified',
          );
          expect(res.body.errors.lastname.msg).toBe(
            'Lastname must be specified',
          );
          expect(res.body.errors.email.msg).toBe('Email is invalid');
          expect(res.body.errors.password.msg).toBe(
            'Password must be at least 8 characters',
          );
          expect(res.body.errors.passwordConfirm.msg).toBe(
            "Passwords don't match",
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for invalid username data', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send({
          role: 'customer',
          firstname: '6848jkkl()',
          lastname: '6848jkkl()',
        })
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.firstname.msg).toBe(
            "Firstname can only contain letters and the characters ('-)",
          );
          expect(res.body.errors.lastname.msg).toBe(
            "Lastname can only contain letters and the characters ('-)",
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for extra length firstname data', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send({ role: 'customer', firstname: longName, lastname: longName })
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.firstname.msg).toBe(
            'Firstname must not be more than 40 characters',
          );
          expect(res.body.errors.lastname.msg).toBe(
            'Lastname must not be more than 40 characters',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for wrong role', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(wrongRoleUserDetails)
        .end((err, res) => {
          // userToken = res.body.token;
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.role.msg).toBe(
            'Role must be specified as either caterer or customer',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for no role', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send({ role: '' })
        .end((err, res) => {
          // userToken = res.body.token;
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.role.msg).toBe(
            'Role field cannot be left blank',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return error for already taken email address', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(
          Object.assign({}, rightUserDetails, { email: 'iveren@shaguy.com' }),
        )
        .end((err, res) => {
          expect(res.statusCode).toBe(409);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.error).toBe('Email already in use');

          if (err) return done(err);
          done();
        });
    });
  });

  describe('Caterer Signup', () => {
    it('should register a new user and returns user data + token for valid data', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(rightCatererDetails)
        .end((err, res) => {
          expect(res.statusCode).toBe(201);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body).toHaveProperty('token');
          expect(res.body.user).toHaveProperty('businessName');
          expect(res.body.user).toHaveProperty('address');
          expect(res.body.user).toHaveProperty('phoneNo');
          expect(res.body.user).toHaveProperty('id');
          expect(res.body.user.email).toBe('wecook@cook.com');
          expect(res.body.user.businessName).toBe('We Cook');

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for wrong input', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(wrongCatererDetails)
        .end((err, res) => {
          // userToken = res.body.token;
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.firstname.msg).toBe('Unaccepted Field');
          expect(res.body.errors.businessName.msg).toBe(
            'Business name must be specified',
          );
          expect(res.body.errors.email.msg).toBe('Email is invalid');
          expect(res.body.errors.password.msg).toBe(
            'Password must be at least 8 characters',
          );
          expect(res.body.errors.passwordConfirm.msg).toBe(
            "Passwords don't match",
          );
          expect(res.body.errors.address.msg).toBe(
            'Business Address must be specified',
          );
          expect(res.body.errors.phoneNo.msg).toBe(
            'Business Phone Number must be in the format 080xxxxxxxx',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for wrong input: long length', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(wrongLengthCatererDetails)
        .end((err, res) => {
          // userToken = res.body.token;
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.businessName.msg).toBe(
            'Business name must not be more than 60 characters',
          );
          expect(res.body.errors.address.msg).toBe(
            'Business Address must be between 5 and 255 characters',
          );
          expect(res.body.errors.phoneNo.msg).toBe(
            'Business Phone Number must be specified',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return validation errors for wrong input: invalid format', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send(invalidCatererDetails)
        .end((err, res) => {
          expect(res.statusCode).toBe(400);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.errors.businessName.msg).toBe(
            "Business name can only contain letters, spaces, and the characters (,.'-)",
          );
          expect(res.body.errors.address.msg).toBe(
            "Business Address can only contain letters, numbers, spaces, and the characters (,.'-)",
          );
          expect(res.body.errors.phoneNo.msg).toBe(
            'Business Phone Number must be in the format 080xxxxxxxx',
          );

          if (err) return done(err);
          done();
        });
    });

    it('should return error for already taken email address', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send({
          ...rightCatererDetails,
          email: 'food@circle.com',
          businessName: 'A Business',
        })
        .end((err, res) => {
          expect(res.statusCode).toBe(409);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.error).toBe('Email already in use');

          if (err) return done(err);
          done();
        });
    });

    it('should return error for already taken business name', (done) => {
      request
        .agent(app)
        .post('/auth/signup')
        .send({ ...rightCatererDetails, email: 'new@circle.com' })
        .end((err, res) => {
          expect(res.statusCode).toBe(409);
          expect(res.body).toEqual(expect.any(Object));
          expect(res.body.error).toBe('Business name already in use');

          if (err) return done(err);
          done();
        });
    });
  });
});
