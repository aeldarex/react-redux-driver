import AccessDriver from '../src/AccessDriver';
import ReduxObject from '../src/ReduxObject';

describe('find', () => {
  test('if object type does not extend ReduxObject throws error', () => {
    expect(() => AccessDriver.find({})).toThrowError(
      'objectType must extend ReduxObject.',
    );
  });

  describe('if object type extends ReduxObject returns selector', () => {
    test('which yields empty list if state slice for object does not exist', () => {
      // Given
      class TestObject extends ReduxObject {}

      // When
      const selector = AccessDriver.find(TestObject);
      const result = selector({});

      // Then
      expect(result).toEqual([]);
    });

    test('which gets all objects of type', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject);
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject1, testObject2]);
    });
  });
});
