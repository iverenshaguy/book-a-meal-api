import mockDate from 'mockdate';
import ValidationHandler from 'src/middlewares/ValidationHandler';
import moment from 'src/utils/moment';

// mock server response
const res = {
  status: (status) => ({
    json: (message) => ({ status, message }),
  }),
};

// mock server request
const req = {
  headers: 'header',
};

const next = jest.fn();
const status = jest.spyOn(res, 'status');
const currentDay = moment().format('YYYY-MM-DD');

describe('Validation Handler: Orders', () => {
  afterEach(() => {
    next.mockClear();
    status.mockClear();
  });

  it('should return error message if shop is closed', () => {
    mockDate.set(
      moment(`${currentDay} 18:00:00`, 'YYYY-MM-DD HH:mm:ss').valueOf(),
    );

    ValidationHandler.isShopOpen(req, res, next);

    expect(status).toHaveBeenCalledWith(200);
  });

  it('should call next if shop is open', () => {
    ValidationHandler.isShopOpen(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
