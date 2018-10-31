import sinon from 'sinon';
import ReduxObject from '../../src/ReduxObject';
import createFindManySelector from '../../src/selectorCreation/createFindManySelector';

test('if filter not specified selector returns all items of type in state', () => {
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
  const selector = createFindManySelector(TestObject);
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject2]);
});

test('if filter is specified selector returns all items matching filter', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(5);
  const testObject2 = new TestObject(10);
  const testObject3 = new TestObject(20);
  const state = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindManySelector(TestObject, { propA: x => x > 5 });
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject2, testObject3]);
});

test('if item throws error in filter function tree selector ignores item', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject('10');
  const testObject2 = new TestObject(20);
  const testObject3 = new TestObject('30');
  const state = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindManySelector(TestObject, {
    propA: x => x.includes('0'),
  });
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject3]);
});

test('given objectType that is not a ReduxObject publishes warning', () => {
  // Given
  const errorStub = sinon.stub(console, 'error');

  // When
  createFindManySelector({});

  // Then
  expect(
    errorStub.calledWith(
      'Warning: To create a working selector objectType must extend ReduxObject.',
    ),
  ).toBe(true);
});
