import checkOrderQuantity from 'src/helpers/checkOrderQuantity';

describe('checkOrderQuantity', () => {
  it('should return true when item is an integer greater than 0', () => {
    const check = checkOrderQuantity([
      { mealId: 'fb097bde-5959-45ff-8e21-51184fa60c25', quantity: 2 },
    ]);

    expect(check).toBe(true);
  });

  it('should throw error when item is not an integer', () => {
    expect(() => checkOrderQuantity([
      { mealId: 'fb097bde-5959-45ff-8e21-51184fa60c25', quantity: 'one' },
    ]),).toThrow(
      'Quantity for meal fb097bde-5959-45ff-8e21-51184fa60c25 must be an integer',
    );
  });

  it('should throw error when item is a negative integer', () => {
    expect(() => checkOrderQuantity([
      { mealId: 'fb097bde-5959-45ff-8e21-51184fa60c25', quantity: -1 },
    ]),).toThrow(
      'Quantity for meal fb097bde-5959-45ff-8e21-51184fa60c25 must be greater than 0',
    );
  });

  it('should throw error when item is 0', () => {
    expect(() => checkOrderQuantity([
      { mealId: 'fb097bde-5959-45ff-8e21-51184fa60c25', quantity: 0 },
    ]),).toThrow(
      'Quantity for meal fb097bde-5959-45ff-8e21-51184fa60c25 must be greater than 0',
    );
  });
});
