import isObjectWithId from '../../src/utils/isObjectWithId';

test('if given object is undefined, returns false', () => {
  // When
  const result = isObjectWithId();

  // Then
  expect(result).toBe(false);
});

test('if given object is null, returns false', () => {
  // When
  const result = isObjectWithId(null);

  // Then
  expect(result).toBe(false);
});

test('if given object is a function, returns false', () => {
  // When
  const result = isObjectWithId(() => {});

  // Then
  expect(result).toBe(false);
});

test('if given object is an object without an id, returns false', () => {
  // When
  const result = isObjectWithId({});

  // Then
  expect(result).toBe(false);
});

test('if given object is an object with an id, returns true', () => {
  // When
  const result = isObjectWithId({ id: '1a' });

  // Then
  expect(result).toBe(true);
});
