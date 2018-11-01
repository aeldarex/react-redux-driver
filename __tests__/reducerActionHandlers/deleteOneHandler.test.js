import sinon from 'sinon';
import deleteOneHandler from '../../src/reducerActionHandlers/deleteOneHandler';
import ReduxObject from '../../src/ReduxObject';

describe('invalid parameter cases', () => {
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

  test('if state is undefined, produces warning', () => {
    // When
    deleteOneHandler();

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_DELETE_ONE action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = deleteOneHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, produces warning', () => {
    // When
    deleteOneHandler(null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_DELETE_ONE action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = deleteOneHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if payload objectType is undefined, produces warning', () => {
    // When
    deleteOneHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
    // When
    deleteOneHandler({}, { objectType: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload objectType is undefined, returns unchanged state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = deleteOneHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload objectType does not extend ReduxObject, returns unchanged state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = deleteOneHandler(existingState, { objectType: {} });

      // Then
      expect(updatedState).toBe(existingState);
    });
  });
});

test('state slice for object is undefined, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingState = {};

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice for object is empty, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingState = { [TestObject.stateSlice]: {} };

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice populated and filter is undefined, deletes first object in state slice', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject2.id]: testObject2,
    },
  });
});

test('state slice populated and filter is null, deletes first object from state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
    filter: null,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject2.id]: testObject2,
    },
  });
});

test('objects exist which match filter, deletes first object matching filter', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(1);
  const testObject2 = new TestObject(2);
  const testObject3 = new TestObject(2);
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject3.id]: testObject3,
    },
  });
});

test('no objects match filter, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(1);
  const testObject2 = new TestObject(1);
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 2 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});
