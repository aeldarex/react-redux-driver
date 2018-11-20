import filterMany from '../../src/sliceInteraction/filterMany';

test('returns array of all indexes which pass given filter', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 10 };
  const obj3 = { propA: 5 };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterMany(table, { propA: 5 });

  // Then
  expect(result).toEqual([
    { index: 0, object: obj1 },
    { index: 2, object: obj3 },
  ]);
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: '5' };
  const obj2 = { propA: 5 };
  const obj3 = { propA: '5' };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterMany(table, { propA: x => x.includes('5') });

  // Then
  expect(result).toEqual([
    { index: 0, object: obj1 },
    { index: 2, object: obj3 },
  ]);
});

test('if no items pass filter returns empty array', () => {
  // Given
  const obj1 = { propA: 15 };
  const obj2 = { propA: 10 };
  const obj3 = { propA: 20 };
  const table = [obj1, obj2, obj3];

  // When
  const result = filterMany(table, { propA: 5 });

  // Then
  expect(result).toEqual([]);
});
