import updateOne from '../../src/sliceInteraction/updateOne';

test('creates copy of object with updates', () => {
  // Given
  class SomeObject {}

  const obj1 = new SomeObject();
  obj1.propA = 5;
  const update = { propA: 10 };

  // When
  const updatedObject = updateOne(obj1, update);

  // Then
  expect(updatedObject).not.toBe(obj1);
  expect(updatedObject).toBeInstanceOf(SomeObject);
  expect(updatedObject).toEqual({ propA: 10 });
});
