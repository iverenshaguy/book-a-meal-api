import validateDate from 'src/helpers/validateDate';

describe('validateDate', () => {
  it('should return true when value is in a valid format', () => {
    const check = validateDate('2018-02-04');

    expect(check).toBe(true);
  });

  it('should throw an error when value is in an invalid format', () => {
    expect(() => validateDate('02-04-2018')).toThrow(
      'Date is invalid, valid format is YYYY-MM-DD',
    );
  });

  it('should throw an error when value is more than usual number ie April 31 instead of 30', () => {
    expect(() => validateDate('2018-04-31')).toThrow('Date is invalid');
  });
});
