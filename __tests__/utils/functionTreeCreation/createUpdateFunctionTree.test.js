import createUpdateFunctionTree from '../../../src/utils/functionTreeCreation/createUpdateFunctionTree';

test('if object is specified with primitive, created function tree sets property of given object to value', () => {
  // Given
  const obj1 = { propA: 1 };

  // When
  const functionList = createUpdateFunctionTree({ propA: 5 });
  functionList.forEach(f => f(obj1));

  // Then
  expect(obj1).toEqual({
    propA: 5,
  });
});

test('if object is specified with function, created function tree applies function to the given object property', () => {
  // Given
  const obj1 = { propA: 5 };

  // When
  const functionList = createUpdateFunctionTree({ propA: x => x + 1 });
  functionList.forEach(f => f(obj1));

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
  const functionList = createUpdateFunctionTree({
    propA: 10,
    propB: { propC: x => x.concat('!') },
  });
  functionList.forEach(f => f(obj1));

  // Then
  expect(obj1).toEqual({
    propA: 10,
    propB: { propC: 'a cool string!' },
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
  const functionList = createUpdateFunctionTree({
    propA: '8',
    propB: { propC: null },
  });
  functionList.forEach(f => f(obj1));

  // Then
  expect(obj1).toEqual({
    propA: '8',
    propB: {
      propC: null,
    },
  });
});
