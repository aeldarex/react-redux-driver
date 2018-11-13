import updateOne from '../../src/sliceInteraction/updateOne';

test('creates copy of object with updates', () => {
  // Given
  const object = { propA: 5 };
  const update = { propA: 10 };

  // When
  const updatedObject = updateOne(object, update);

  // Then
  expect(updatedObject).not.toBe(object);
  expect(updatedObject).toEqual({ propA: 10 });
});
