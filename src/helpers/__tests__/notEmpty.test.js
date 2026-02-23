import notEmpty from 'src/helpers/notEmpty';

describe('notEmpty', () => {
  it('should return true when value is not empty', () => {
    const check = notEmpty('yes', 'string field cannot be left blank');

    expect(check).toBe(true);
  });

  it('should throw an error when value is empty', () => {
    expect(() => notEmpty('', 'string field cannot be left blank')).toThrow(
      'string field cannot be left blank',
    );
  });
});
