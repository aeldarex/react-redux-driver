import sinon from 'sinon';
import ReduxObject from '../../src/ReduxObject';
import createFindManySelector from '../../src/selectorCreation/createFindManySelector';

const invalidParametersWarning = 'Warning: To create a working selector objectDefinition must have a stateSlice property.';

describe('invalid parameters', () => {
  let errorStub;

  beforeAll(() => {
    errorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    errorStub.reset();
  });

  afterAll(() => {
    errorStub.restore();
  });

  test('if objectDefinition is missing, publishes warning', () => {
    // When
    createFindManySelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if objectDefinition does not have a stateSlice prop, publishes warning', () => {
    // When
    createFindManySelector({});

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if objectDefinition is missing, selector returns empty object', () => {
    // When
    const selector = createFindManySelector();
    const result = selector({});

    // Then
    expect(result).toEqual([]);
  });
});

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
