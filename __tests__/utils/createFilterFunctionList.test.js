import createFilterFunctionList from '../../src/utils/createFilterFunctionList';

test('if filter object is specified with primitive, created function list returns true for input objects which match with ===', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionList = createFilterFunctionList({ propA: 5 });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(true);
});

test('if filter object is specified with primitive, created function list returns false for input objects which do not match with ===', () => {
  // Given
  const obj1 = { propA: '5' };

  // When
  const functionList = createFilterFunctionList({ propA: 5 });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(false);
});

test('if filter object is specified with function, created function list returns true for input objects satisfying function', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionList = createFilterFunctionList({ propA: x => x > 2 });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(true);
});

test('if filter object is specified with function, created function list returns false for input objects not satisfying function', () => {
  // Given
  const obj1 = { propA: 1 };

  // When
  const functionList = createFilterFunctionList({ propA: x => x > 2 });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(false);
});

test('if filter object is specified with depth greater than 1, created function list returns true for input objects matching at various levels', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionList = createFilterFunctionList({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(true);
});

test('if filter object is specified with depth greater than 1, created function list returns false for input objects not matching at shallow level', () => {
  // Given
  const obj1 = {
    propA: 1,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionList = createFilterFunctionList({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(false);
});

test('if filter object is specified with depth greater than 1, created function list returns false for input objects not matching at deeper level', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a lame string',
    },
  };

  // When
  const functionList = createFilterFunctionList({
    propA: 5,
    propB: { propC: x => x.includes('cool') },
  });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(false);
});

test('if filter object contains nulls, created function list returns true for input objects matching nulls', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: null,
    },
  };

  // When
  const functionList = createFilterFunctionList({
    propA: 5,
    propB: { propC: null },
  });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(true);
});

test('if filter object contains nulls, created function list returns false for input objects not matching nulls', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionList = createFilterFunctionList({
    propA: 5,
    propB: { propC: null },
  });
  const result = functionList.every(f => f(obj1));

  // Then
  expect(result).toBe(false);
});
