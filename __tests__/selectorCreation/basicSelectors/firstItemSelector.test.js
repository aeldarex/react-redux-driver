import firstItemSelector from '../../../src/selectorCreation/basicSelectors/firstItemSelector';

test('selector returns first value of an array', () => {
  // Given
  const array = [5, 10, 15];

  // When
  const result = firstItemSelector(array);

  // Then
  expect(result).toEqual(5);
});

test('if given undefined selector returns null', () => {
  // When
  const result = firstItemSelector();

  // Then
  expect(result).toBeNull();
});

test('if given null selector returns null', () => {
  // When
  const result = firstItemSelector(null);

  // Then
  expect(result).toBeNull();
});

test('if given object selector returns null', () => {
  // When
  const result = firstItemSelector({});

  // Then
  expect(result).toBeNull();
});

test('if given function selector returns null', () => {
  // When
  const result = firstItemSelector(() => {});

  // Then
  expect(result).toBeNull();
});
