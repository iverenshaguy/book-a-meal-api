import { order as mockData } from 'src/utils/test-utils/mockData';
import isValidOrderItems from 'src/helpers/isValidOrderItems';

const { validOrderDetails, inValidOrderDetails } = mockData;

describe('isValidOrderItems', () => {
  it('should return true when order items are valid', async () => {
    const check = await isValidOrderItems(validOrderDetails.meals);

    expect(check).toBe(true);
  });

  it('should return err when order items are invalid', async () => {
    try {
      await isValidOrderItems(inValidOrderDetails.meals);
    } catch (err) {
      expect(err.message).toBe(
        'Meal 8a65538d-f862-420e-bcdc-80743df06578 is not available',
      );
    }
  });
});
