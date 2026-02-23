import {
  expiredToken,
  tokens,
  wrongSecretToken,
} from 'src/utils/test-utils/setup';
import Authorization from 'src/middlewares/Authorization';

const { emiolaToken, foodCircleToken } = tokens;

// mock server response
const res = {
  json: (message) => ({ message }),
  status: (status) => ({
    json: (message) => ({ status, message }),
  }),
};

const status = jest.spyOn(res, 'status');
const next = jest.fn();

afterEach(() => {
  status.mockClear();
  next.mockClear();
});

describe('Authorization Handler', () => {
  describe('Admin Auth', () => {
    it('should send error 401 for unauthenticated user', () => {
      const unAuthReq = { headers: { authorization: '' } };
      Authorization.authorize(unAuthReq, res, next);

      expect(status).toHaveBeenCalledWith(401);
    });

    it("should send error 403 for forbidden user ie user that's not admin", () => {
      const forbReq = { role: 'user', headers: { authorization: emiolaToken } };
      const authorization = new Authorization('caterer');
      authorization.authorizeRole(forbReq, res, next);

      expect(status).toHaveBeenCalledWith(403);
    });

    it('should call next for authenticated caterer', () => {
      const authReq = {
        role: 'caterer',
        headers: { authorization: foodCircleToken },
      };
      const authorization = new Authorization('caterer');
      authorization.authorizeRole(authReq, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe('User Auth', () => {
    it('should send error 401 for wrong token secret', () => {
      const unAuthReq = { headers: { authorization: wrongSecretToken } };
      Authorization.authorize(unAuthReq, res, next);

      expect(status).toHaveBeenCalledWith(401);
    });

    it('should send error 401 for expired token', () => {
      const unAuthReq = { headers: { authorization: expiredToken } };
      Authorization.authorize(unAuthReq, res, next);

      expect(status).toHaveBeenCalledWith(401);
    });

    it('should call next for authenticated user', () => {
      const authReq = { role: 'user', headers: { authorization: emiolaToken } };
      const authorization = new Authorization('user');
      authorization.authorizeRole(authReq, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
