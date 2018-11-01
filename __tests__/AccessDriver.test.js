import AccessDriver from '../src/AccessDriver';
import ReduxObject from '../src/ReduxObject';

test('creates a findMany selector for the given object type and filter', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(1);
  const testObject2 = new TestObject(2);
  const testObject3 = new TestObject(3);
  const state = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = AccessDriver.find(TestObject, { propA: x => x >= 2 });
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject2, testObject3]);
});
