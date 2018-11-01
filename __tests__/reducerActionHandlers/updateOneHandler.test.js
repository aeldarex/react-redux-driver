import sinon from 'sinon';
import updateOneHandler from '../../src/reducerActionHandlers/updateOneHandler';
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
    updateOneHandler();

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_ONE action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = updateOneHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, produces warning', () => {
    // When
    updateOneHandler(null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_ONE action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateOneHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if payload objectType is undefined, produces warning', () => {
    // When
    updateOneHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
    // When
    updateOneHandler({}, { objectType: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  test('if payload update is undefined, produces warning', () => {
    // When
    updateOneHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is null, produces warning', () => {
    // When
    updateOneHandler({}, { update: null });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is empty, produces warning', () => {
    // When
    updateOneHandler({}, { update: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload objectType is undefined, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateOneHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload objectType does not extend ReduxObject, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateOneHandler(existingState, { objectType: {} });

      // Then
      expect(updatedState).toBe(existingState);
    });

    describe('given objectType which does extend ReduxObject', () => {
      test('if payload update is undefined, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = {};

        // When
        const updatedState = updateOneHandler(existingState, {
          objectType: TestObject,
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('if payload update is null, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = {};

        // When
        const updatedState = updateOneHandler(existingState, {
          objectType: TestObject,
          update: null,
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('if payload update is empty object, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = {};

        // When
        const updatedState = updateOneHandler(existingState, {
          objectType: TestObject,
          update: {},
        });

        // Then
        expect(updatedState).toBe(existingState);
      });
    });
  });
});

// Start

test('state slice for object is undefined, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingState = {};

  // When
  const updatedState = updateOneHandler(existingState, {
    objectType: TestObject,
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice for object is empty, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingState = { [TestObject.stateSlice]: {} };

  // When
  const updatedState = updateOneHandler(existingState, {
    objectType: TestObject,
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('if no filter specified, updates first object in state slice', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, 10);
  const testObject2 = new TestObject(2, 20);
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    objectType: TestObject,
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState[TestObject.stateSlice][testObject1.id]).not.toBe(
    existingState[TestObject.stateSlice][testObject1.id],
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: { ...testObject1, propA: 5, propB: 20 },
      [testObject2.id]: testObject2,
    },
  });
});

test('if objects are found which match filter, updates first matching object', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, 10);
  const testObject2 = new TestObject(2, 20);
  const testObject3 = new TestObject(2, 20);
  const existingStateSlice = {
    [testObject1.id]: testObject1,
    [testObject2.id]: testObject2,
    [testObject3.id]: testObject3,
  };
  const existingState = {
    [TestObject.stateSlice]: existingStateSlice,
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 2, propB: 20 },
    update: { propA: 6, propB: x => x * 3 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState[TestObject.stateSlice][testObject2.id]).not.toBe(
    existingState[TestObject.stateSlice][testObject2.id],
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: { ...testObject2, propA: 6, propB: 60 },
      [testObject3.id]: testObject3,
    },
  });
});

test('but no matching object, returns given state', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, 10);
  const testObject2 = new TestObject(2, 20);
  const existingState = {
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 3, propB: 30 },
    update: { propA: 7, propB: x => x * 4 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

describe('update errors', () => {
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

  test('if objects are found which match filter but update fails, returns given state', () => {
    // Given
    class TestObject extends ReduxObject {
      constructor(propA, propB) {
        super();
        this.propA = propA;
        this.propB = propB;
      }
    }

    const testObject1 = new TestObject(1, 10);
    const testObject2 = new TestObject(2, 20);
    const testObject3 = new TestObject(2, 20);
    const existingStateSlice = {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    };
    const existingState = {
      [TestObject.stateSlice]: existingStateSlice,
    };

    // When
    const updatedState = updateOneHandler(existingState, {
      objectType: TestObject,
      filter: { propA: 2, propB: 20 },
      update: { propA: 6, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).toBe(existingState);
  });
});
