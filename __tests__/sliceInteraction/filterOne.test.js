import filterOne from '../../src/sliceInteraction/filterOne';

test('returns entry of first object which passes given filter', () => {
  // Given
  const obj1 = { propA: 10 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: 5 };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterOne(table, { propA: 5 });

  // Then
  expect(result).toEqual({ index: 1, object: obj2 });
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: '5' };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterOne(table, { propA: x => x.includes('5') });

  // Then
  expect(result).toEqual({ index: 2, object: obj3 });
});

test('returns undefined if no matching items found', () => {
  // Given
  const obj1 = { propA: 10 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: 5 };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterOne(table, { propA: 1 });

  // Then
  expect(result).not.toBeDefined();
});
