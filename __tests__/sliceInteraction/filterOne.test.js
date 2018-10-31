import filterOne from '../../src/sliceInteraction/filterOne';

test('returns first object which passes given filter', () => {
  // Given
  const obj1 = { propA: 10 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: 5 };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  // When
  const result = filterOne(table, { propA: 5 });

  // Then
  expect(result).toEqual(obj2);
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: '5' };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  // When
  const result = filterOne(table, { propA: x => x.includes('5') });

  // Then
  expect(result).toEqual(obj3);
});
