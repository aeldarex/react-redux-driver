import createUpdateFunctionTree from '../../src/functionTreeCreation/createUpdateFunctionTree';

test('if object is specified with primitive, created function tree sets property of given object to value', () => {
  // Given
  const obj1 = { propA: 1 };

  // When
  const functionTree = createUpdateFunctionTree({ propA: 5 });
  functionTree(obj1);

  // Then
  expect(obj1).toEqual({
    propA: 5,
  });
});

test('if object is specified with function, created function tree applies function to the given object property', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionTree = createUpdateFunctionTree({ propA: x => x + 1 });
  functionTree(obj1);

  // Then
  expect(obj1).toEqual({
    propA: 6,
  });
});

test('if object is specified with depth greater than 1, created function tree applies updates across various levels', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a cool string',
    },
  };

  // When
  const functionTree = createUpdateFunctionTree({
    propA: 10,
    propB: { propC: x => x.concat('!') },
  });
  functionTree(obj1);

  // Then
  expect(obj1).toEqual({
    propA: 10,
    propB: { propC: 'a cool string!' },
  });
});

test('if object is specified with depth greater than 1 and part of the expected object tree is missing, populates the object correctly', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionTree = createUpdateFunctionTree({
    propA: 10,
    propB: { propC: 'a new string!' },
  });
  functionTree(obj1);

  // Then
  expect(obj1).toEqual({
    propA: 10,
    propB: { propC: 'a new string!' },
  });
});

test('if object contains nulls, created function tree applies nulls to given object correctly', () => {
  // Given
  const obj1 = {
    propA: 5,
    propB: {
      propC: 'a lame string',
    },
  };

  // When
  const functionTree = createUpdateFunctionTree({
    propA: '8',
    propB: { propC: null },
  });
  functionTree(obj1);

  // Then
  expect(obj1).toEqual({
    propA: '8',
    propB: {
      propC: null,
    },
  });
});
