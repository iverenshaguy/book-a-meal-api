import ErrorHandler from 'src/middlewares/ErrorHandler';

// mock server response
const res = {
  headersSent: false,
  status: (status) => ({
    json: (message) => ({ status, message }),
  }),
};

// mock server request
const req = {
  headers: 'header',
};

const err = {
  status: 400,
  message: 'error',
};

const next = jest.fn();
const status = jest.spyOn(res, 'status');

afterEach(() => {
  status.mockClear();
  next.mockClear();
  res.headersSent = false;
});

describe('Error Handler', () => {
  it('should handle errors with no headers sent', () => {
    ErrorHandler.sendError(err, req, res, next);

    expect(status).toHaveBeenCalledWith(400);
  });

  it('should handle errors with no headers sent and no status', () => {
    ErrorHandler.sendError({ message: 'error' }, req, res, next);

    expect(status).toHaveBeenCalledWith(500);
  });

  it('should handle errors with headers sent', () => {
    res.headersSent = true;
    ErrorHandler.sendError(err, req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
