import { helpers as mockData } from 'src/utils/test-utils/mockData';
import isArrayOfUUID from 'src/helpers/isArrayOfUUID';

const {
  checkMealsId: { arrayOfWrongIds, arrayOfUuids },
} = mockData;

describe('isArrayOfUUID', () => {
  it('should return true when it is an array of UUIDs', () => {
    const check = isArrayOfUUID(arrayOfUuids);

    expect(check).toBe(true);
  });

  it('should return false when it is not an array of UUIDs', () => {
    expect(() => isArrayOfUUID(arrayOfWrongIds)).toThrow(
      ' MealId iieie is invalid, MealId siioe is invalid',
    );
  });
});
