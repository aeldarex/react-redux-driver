import isEmptyObject from '../../src/utils/isEmptyObject';

test('given empty object, returns true', () => {
  expect(isEmptyObject({})).toBe(true);
});

test('given populated object, returns false', () => {
  expect(isEmptyObject({ propA: 'propAValue' })).toBe(false);
});
