import createSliceSelector from '../../src/selectorCreation/createSliceSelector';

test('creates selector which returns state slice indicated by given sliceName', () => {
  // Given
  const stateSliceA = {};

  // When
  const selector = createSliceSelector('stateSliceA');
  const result = selector({ stateSliceA });

  // Then
  expect(result).toBe(stateSliceA);
});

test('if slice is undefined selector returns empty object', () => {
  // When
  const selector = createSliceSelector('stateSliceA');
  const result = selector({});

  // Then
  expect(result).toEqual({});
});

test('if slice is null selector returns empty object', () => {
  // When
  const selector = createSliceSelector('stateSliceA');
  const result = selector({ stateSliceA: null });

  // Then
  expect(result).toEqual({});
});
