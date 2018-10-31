import allValuesSelector from '../../../src/selectorCreation/basicSelectors/allValuesSelector';

test('selector returns all of an objects values', () => {
  // Given
  const obj = {
    propA: 5,
    propB: 10,
    propC: 15,
  };

  // When
  const result = allValuesSelector(obj);

  // Then
  expect(result).toEqual([5, 10, 15]);
});

test('if given undefined selector returns empty array', () => {
  // When
  const result = allValuesSelector();

  // Then
  expect(result).toEqual([]);
});

test('if given null selector returns empty array', () => {
  // When
  const result = allValuesSelector(null);

  // Then
  expect(result).toEqual([]);
});
