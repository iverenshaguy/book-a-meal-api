import TrimValues from 'src/middlewares/TrimValues';

const req = {
  body: {
    one: 'ioperj    ',
    two: '   jii',
    three: false,
  },
};

// mock server response
const res = {
  json: (message) => ({ message }),
  status: (status) => ({
    json: (message) => ({ status, message }),
  }),
};

const next = jest.fn();

describe('TrimValues', () => {
  it('should return trimmed object', () => {
    TrimValues.trim(req, res, next);

    expect(req.body).toEqual({
      one: 'ioperj',
      two: 'jii',
      three: false,
    });
    expect(next).toHaveBeenCalled();
  });
});
