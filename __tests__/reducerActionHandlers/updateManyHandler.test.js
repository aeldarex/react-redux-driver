import sinon from 'sinon';
import updateManyHandler from '../../src/reducerActionHandlers/updateManyHandler';
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
    updateManyHandler();

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_MANY action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = updateManyHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, produces warning', () => {
    // When
    updateManyHandler(null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_MANY action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateManyHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if payload objectType is undefined, produces warning', () => {
    // When
    updateManyHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
    // When
    updateManyHandler({}, { objectType: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
      ),
    ).toBe(true);
  });

  test('if payload update is undefined, produces warning', () => {
    // When
    updateManyHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_MANY action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is null, produces warning', () => {
    // When
    updateManyHandler({}, { update: null });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_MANY action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is empty, produces warning', () => {
    // When
    updateManyHandler({}, { update: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_MANY action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload objectType is undefined, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateManyHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload objectType does not extend ReduxObject, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateManyHandler(existingState, { objectType: {} });

      // Then
      expect(updatedState).toBe(existingState);
    });

    describe('given objectType which does extend ReduxObject', () => {
      test('if payload update is undefined, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = {};

        // When
        const updatedState = updateManyHandler(existingState, {
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
        const updatedState = updateManyHandler(existingState, {
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
        const updatedState = updateManyHandler(existingState, {
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
  const updatedState = updateManyHandler(existingState, {
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
  const updatedState = updateManyHandler(existingState, {
    objectType: TestObject,
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('if no filter specified, updates all objects in state slice', () => {
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
  const updatedState = updateManyHandler(existingState, {
    objectType: TestObject,
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState[TestObject.stateSlice][testObject1.id]).not.toBe(
    testObject1,
  );
  expect(updatedState[TestObject.stateSlice][testObject2.id]).not.toBe(
    testObject2,
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: { ...testObject1, propA: 5, propB: 20 },
      [testObject2.id]: { ...testObject2, propA: 5, propB: 40 },
    },
  });
});

test('if objects are found which match filter, updates all matching objects', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, 10);
  const testObject2 = new TestObject(2, 30);
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
  const updatedState = updateManyHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 2 },
    update: { propA: 6, propB: x => x * 3 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(
    existingState[TestObject.stateSlice],
  );
  expect(updatedState[TestObject.stateSlice][testObject2.id]).not.toBe(
    testObject2,
  );
  expect(updatedState[TestObject.stateSlice][testObject3.id]).not.toBe(
    testObject3,
  );
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: { ...testObject2, propA: 6, propB: 90 },
      [testObject3.id]: { ...testObject3, propA: 6, propB: 60 },
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
  const updatedState = updateManyHandler(existingState, {
    objectType: TestObject,
    filter: { propA: 3 },
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

  test('if all objects matching filter fail to update, returns given state', () => {
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
    const updatedState = updateManyHandler(existingState, {
      objectType: TestObject,
      filter: { propA: 2 },
      update: { propA: 6, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).toBe(existingState);
  });

  test("if some objects matching filter fail to update, updates only objects that don't fail", () => {
    // Given
    class TestObject extends ReduxObject {
      constructor(propA, propB) {
        super();
        this.propA = propA;
        this.propB = propB;
      }
    }

    const testObject1 = new TestObject(1, 10);
    const testObject2 = new TestObject(2, '20');
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
    const updatedState = updateManyHandler(existingState, {
      objectType: TestObject,
      filter: { propA: 2 },
      update: { propA: 6, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).not.toBe(existingState);
    expect(updatedState[TestObject.stateSlice]).not.toBe(
      existingState[TestObject.stateSlice],
    );
    expect(updatedState[TestObject.stateSlice][testObject2.id]).not.toBe(
      testObject2,
    );
    expect(updatedState).toEqual({
      [TestObject.stateSlice]: {
        [testObject1.id]: testObject1,
        [testObject2.id]: { ...testObject2, propA: 6, propB: '200' },
        [testObject3.id]: testObject3,
      },
    });
  });
});
