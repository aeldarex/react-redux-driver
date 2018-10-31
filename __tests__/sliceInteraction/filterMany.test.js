import filterMany from '../../src/sliceInteraction/filterMany';

test('returns array of all objects which pass given filter', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 10 };
  const obj3 = { propA: 5 };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  // When
  const result = filterMany(table, { propA: 5 });

  // Then
  expect(result).toEqual([obj1, obj3]);
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: '5' };
  const obj2 = { propA: 5 };
  const obj3 = { propA: '5' };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  // When
  const result = filterMany(table, { propA: x => x.includes('5') });

  // Then
  expect(result).toEqual([obj1, obj3]);
});
