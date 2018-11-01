import sinon from 'sinon';
import insertManyHandler from '../../src/reducerActionHandlers/insertManyHandler';
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
    insertManyHandler();

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_MANY action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = insertManyHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, produces warning', () => {
    // When
    insertManyHandler(null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_MANY action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = insertManyHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if given payload is not an array, produces warning', () => {
    // When
    insertManyHandler({}, {});

    // Then
    expect(errorStub.calledOnce).toBe(true);
    expect(errorStub.getCall(0).args[0]).toBe(
      'Warning: A DRIVER_INSERT_MANY action was ignored because the payload was not an array.',
    );
  });

  describe('given defined state', () => {
    test('if given payload is not an array, returns given state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = insertManyHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });
  });
});

describe('mixed object type arrays', () => {
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

  test('given array does not contain any ReduxObject objects, produces warnings for each', () => {
    // When
    insertManyHandler({}, [{}, {}]);

    // Then
    expect(errorStub.callCount).toBe(2);
    expect(
      errorStub.alwaysCalledWithExactly(
        'Warning: An item in a DRIVER_INSERT_MANY action was ignored because it was not an instance of a ReduxObject.',
      ),
    ).toBe(true);
  });

  test('given array does not contain any ReduxObject objects, returns given state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = insertManyHandler(existingState, [{}, {}]);

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('given array of mixed objects, produces warnings for objects which are not instances of ReduxObject', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject1 = new TestObject();
    const testObject2 = new TestObject();

    // When
    insertManyHandler({}, [{}, testObject1, {}, testObject2, {}]);

    // Then
    expect(errorStub.callCount).toBe(3);
    expect(
      errorStub.alwaysCalledWithExactly(
        'Warning: An item in a DRIVER_INSERT_MANY action was ignored because it was not an instance of a ReduxObject.',
      ),
    ).toBe(true);
  });

  test('given array of mixed objects, inserts objects which are instances of ReduxObject', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject1 = new TestObject();
    const testObject2 = new TestObject();

    const existingState = {};

    // When
    const updatedState = insertManyHandler(existingState, [
      {},
      testObject1,
      {},
      testObject2,
      {},
    ]);

    // Then
    expect(updatedState).not.toBe(existingState);
    expect(updatedState).toEqual({
      [TestObject.stateSlice]: {
        [testObject1.id]: testObject1,
        [testObject2.id]: testObject2,
      },
    });
  });
});

test('given array of ReduxObject objects and state slice undefined, creates state slice and inserts ReduxObject objects', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  const existingState = {};

  // When
  const updatedState = insertManyHandler(existingState, [
    testObject1,
    testObject2,
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  });
});

test('objects in state slice have different ids than given ReduxObject objects, inserts objects', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingTestObject1 = new TestObject();
  const existingTestObject2 = new TestObject();
  const existingStateSlice = {
    [existingTestObject1.id]: existingTestObject1,
    [existingTestObject2.id]: existingTestObject2,
  };
  const existingState = {
    [TestObject.stateSlice]: existingStateSlice,
  };

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  // When
  const updatedState = insertManyHandler(existingState, [
    testObject1,
    testObject2,
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      ...existingStateSlice,
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  });
});

test('some objects with ids already exist in state, only adds objects with new ids to state', () => {
  // Given
  class TestObject extends ReduxObject {}

  const existingTestObject = new TestObject();
  const existingStateSlice = {
    [existingTestObject.id]: existingTestObject,
  };
  const existingState = {
    [TestObject.stateSlice]: existingStateSlice,
  };

  const newTestObjectWithSameId = new TestObject();
  newTestObjectWithSameId.id = existingTestObject.id;
  newTestObjectWithSameId.propA = 5;
  const newTestObject = new TestObject();

  // When
  const updatedState = insertManyHandler(existingState, [
    existingTestObject,
    newTestObject,
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[TestObject.stateSlice]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [TestObject.stateSlice]: {
      ...existingStateSlice,
      [newTestObject.id]: newTestObject,
    },
  });
});
