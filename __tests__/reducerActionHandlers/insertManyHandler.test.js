import sinon from 'sinon';
import insertManyHandler from '../../src/reducerActionHandlers/insertManyHandler';
import ReduxObject from '../../src/ReduxObject';

let warningStub;

beforeEach(() => {
  warningStub = sinon.stub(console, 'error');
});

afterEach(() => {
  warningStub.restore();
});

test('if state is undefined, produces warning', () => {
  // When
  insertManyHandler();

  // Then
  expect(
    warningStub.calledWith(
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
    warningStub.calledWith(
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
  expect(warningStub.calledOnce).toBe(true);
  expect(warningStub.getCall(0).args[0]).toBe(
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

  describe('if given payload is an array', () => {
    test('which does not contain ReduxObject objects, returns given state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = insertManyHandler(existingState, [{}, {}]);

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if given payload is an array of mixed objects, produces warnings for objects which are not instances of ReduxObject', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();

      // When
      insertManyHandler({}, [testObject1, {}, testObject2, {}]);

      // Then
      expect(warningStub.callCount).toBe(2);
      expect(
        warningStub.alwaysCalledWithExactly(
          'Warning: An item in a DRIVER_INSERT_MANY action was ignored because it was not an instance of a ReduxObject.',
        ),
      ).toBe(true);
    });

    test('which contains ReduxObject objects, returns new state object', () => {
      // Given
      const existingState = {};

      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();

      // When
      const updatedState = insertManyHandler(existingState, [
        testObject1,
        testObject2,
      ]);

      // Then
      expect(updatedState).not.toBe(existingState);
    });

    describe('and state slice is missing', () => {
      test('creates state slice and inserts objects', () => {
        // Given
        class TestObject extends ReduxObject {}

        const testObject1 = new TestObject();
        const testObject2 = new TestObject();

        // When
        const updatedState = insertManyHandler({}, [testObject1, testObject2]);

        // Then
        expect(updatedState).toEqual({
          [TestObject.stateSlice]: {
            [testObject1.id]: testObject1,
            [testObject2.id]: testObject2,
          },
        });
      });
    });

    describe('and state slice exists', () => {
      test('returns state object with new state slice object', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingStateSlice = {};
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
        expect(updatedState[TestObject.stateSlice]).not.toBe(
          existingStateSlice,
        );
      });

      test('and objects with ids do not exist, adds objects to state slice', () => {
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
        expect(updatedState).toEqual({
          [TestObject.stateSlice]: {
            ...existingStateSlice,
            [testObject1.id]: testObject1,
            [testObject2.id]: testObject2,
          },
        });
      });

      test('and some objects with ids already exist, only adds objects with new ids to state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingTestObject = new TestObject();
        const existingStateSlice = {
          [existingTestObject.id]: existingTestObject,
        };
        const existingState = {
          [TestObject.stateSlice]: existingStateSlice,
        };

        const newTestObject = new TestObject();

        // When
        const updatedState = insertManyHandler(existingState, [
          existingTestObject,
          newTestObject,
        ]);

        // Then
        expect(updatedState).toEqual({
          [TestObject.stateSlice]: {
            ...existingStateSlice,
            [newTestObject.id]: newTestObject,
          },
        });
      });

      test('and some objects with ids already exist, does not overwrite existing objects', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingTestObject = new TestObject();
        const existingStateSlice = {
          [existingTestObject.id]: existingTestObject,
        };
        const existingState = {
          [TestObject.stateSlice]: existingStateSlice,
        };

        const newTestObject = new TestObject();

        const newObjectWithExistingId = new TestObject();
        newObjectWithExistingId.id = existingTestObject.id;

        // When
        const updatedState = insertManyHandler(existingState, [
          newObjectWithExistingId,
          newTestObject,
        ]);

        // Then
        expect(updatedState[TestObject.stateSlice][existingTestObject.id]).toBe(
          existingTestObject,
        );
      });
    });
  });
});
