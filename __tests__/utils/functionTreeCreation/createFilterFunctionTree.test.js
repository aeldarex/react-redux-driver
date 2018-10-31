import createFilterFunctionTree from '../../../src/utils/functionTreeCreation/createFilterFunctionTree';

test('if object is specified with primitive, created function tree returns true for input objects which match with ===', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionTree = createFilterFunctionTree({ propA: 5 });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(true);
});

test('if object is specified with primitive, created function tree returns false for input objects which do not match with ===', () => {
  // Given
  const obj1 = { propA: '5' };

  // When
  const functionTree = createFilterFunctionTree({ propA: 5 });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(false);
});

test('if object is specified with function, created function tree returns true for input objects satisfying function', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionTree = createFilterFunctionTree({ propA: x => x > 2 });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(true);
});

test('if object is specified with function, created function tree returns false for input objects not satisfying function', () => {
  // Given
  const obj1 = { propA: 1 };

  // When
  const functionTree = createFilterFunctionTree({ propA: x => x > 2 });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(false);
});

test('if object is specified with depth greater than 1, created function tree returns true for input objects matching at various levels', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionTree = createFilterFunctionTree({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(true);
});

test('if object is specified with depth greater than 1, created function tree returns false for input objects not matching at shallow level', () => {
  // Given
  const obj1 = {
    propA: 1,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionTree = createFilterFunctionTree({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(false);
});

test('if object is specified with depth greater than 1, created function tree returns false for input objects not matching at deeper level', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a lame string',
    },
  };

  // When
  const functionTree = createFilterFunctionTree({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(false);
});

test('if object contains nulls, created function tree returns true for input objects matching nulls', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: null,
    },
  };

  // When
  const functionTree = createFilterFunctionTree({
    propA: 5,
    propB: { propC: null },
  });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(true);
});

test('if object contains nulls, created function tree returns false for input objects not matching nulls', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionTree = createFilterFunctionTree({
    propA: 5,
    propB: { propC: null },
  });
  const result = functionTree(obj1);

  // Then
  expect(result).toBe(false);
});
