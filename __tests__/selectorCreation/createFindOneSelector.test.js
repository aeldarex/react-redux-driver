import sinon from 'sinon';
import ReduxObject from '../../src/ReduxObject';
import createFindOneSelector from '../../src/selectorCreation/createFindOneSelector';

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
    createFindOneSelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if objectDefinition does not have a stateSlice prop, publishes warning', () => {
    // When
    createFindOneSelector({});

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if objectDefinition is missing, selector returns empty object', () => {
    // When
    const selector = createFindOneSelector();
    const result = selector({});

    // Then
    expect(result).not.toBeDefined();
  });
});

test('if filter not specified selector returns first item of type in state', () => {
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
  const selector = createFindOneSelector(TestObject);
  const result = selector(state);

  // Then
  expect(result).toEqual(testObject1);
});

test('if filter is specified selector returns first item matching filter', () => {
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
  const selector = createFindOneSelector(TestObject, { propA: x => x > 5 });
  const result = selector(state);

  // Then
  expect(result).toEqual(testObject2);
});

test('if item throws error in filter function tree selector ignores item', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject('5');
  const testObject2 = new TestObject(10);
  const testObject3 = new TestObject('20');
  const state = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindOneSelector(TestObject, {
    propA: x => x.includes('0'),
  });
  const result = selector(state);

  // Then
  expect(result).toEqual(testObject3);
});
