import isPopulatedString from '../../src/utils/isPopulatedString';

test('if object is undefined returns false', () => {
  // When
  const result = isPopulatedString();

  // Then
  expect(result).toBe(false);
});

test('if object is null returns false', () => {
  // When
  const result = isPopulatedString(null);

  // Then
  expect(result).toBe(false);
});

test('if object is not a string returns false', () => {
  // When
  const result = isPopulatedString({});

  // Then
  expect(result).toBe(false);
});

test('if object is an empty string returns false', () => {
  // When
  const result = isPopulatedString('');

  // Then
  expect(result).toBe(false);
});

test('if object is a string with length > 1 returns true', () => {
  // When
  const result = isPopulatedString('someString');

  // Then
  expect(result).toBe(true);
});
