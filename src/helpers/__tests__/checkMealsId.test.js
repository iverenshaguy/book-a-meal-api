import { helpers as mockData } from 'src/utils/test-utils/mockData';
import checkMealsId from 'src/helpers/checkMealsId';

const {
  checkMealsId: { arrayOfWrongIds, arrayOfUuids },
} = mockData;

describe('checkMealsId', () => {
  it('should return true when item is an array of UUIDs ', () => {
    const check = checkMealsId(arrayOfUuids);

    expect(check).toBe(true);
  });

  it('should return error when item is an array of non-UUIDs ', () => {
    expect(() => checkMealsId(arrayOfWrongIds)).toThrow(
      'MealId iieie is invalid, MealId siioe is invalid',
    );
  });

  it('should return false when item is an empty array', () => {
    const check = checkMealsId([]);

    expect(check).toBe(false);
  });

  it('should return false when item is a string', () => {
    expect(checkMealsId('str')).toBe(false);
  });

  it('should return false when item is an object', () => {
    expect(checkMealsId({ siioe: 'siioe' })).toBe(false);
  });

  it('should return false when item is a number', () => {
    expect(checkMealsId(1)).toBe(false);
  });

  it('should return false when item is null/undefined', () => {
    expect(checkMealsId()).toBe(false);
    expect(checkMealsId(null)).toBe(false);
    expect(checkMealsId(undefined)).toBe(false);
  });
});
