import isObjectWithOwnProps from '../../src/utils/isObjectWithOwnProps';

test('given undefined, returns false', () => {
  expect(isObjectWithOwnProps(undefined)).toBe(false);
});

test('given null, returns false', () => {
  expect(isObjectWithOwnProps(null)).toBe(false);
});

test('given empty object, returns false', () => {
  expect(isObjectWithOwnProps({})).toBe(false);
});

test('given populated object, returns true', () => {
  expect(isObjectWithOwnProps({ propA: 'propAValue' })).toBe(true);
});

test('given function, returns false', () => {
  expect(isObjectWithOwnProps(() => {})).toBe(false);
});
