import sinon from 'sinon';
import insertOneHandler from '../../src/reducerActionHandlers/insertOneHandler';
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
  insertOneHandler();

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_INSERT_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is undefined, returns empty object', () => {
  // When
  const updatedState = insertOneHandler();

  // Then
  expect(updatedState).toEqual({});
});

test('if state is null, produces warning', () => {
  // When
  insertOneHandler(null);

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_INSERT_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is null, returns empty object', () => {
  // When
  const updatedState = insertOneHandler(null);

  // Then
  expect(updatedState).toEqual({});
});

test('if given payload is undefined, produces warning', () => {
  // When
  insertOneHandler({});

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_INSERT_ONE action was ignored because the payload was not an instance of a ReduxObject.',
    ),
  ).toBe(true);
});

test('if given payload is not an instance of a ReduxObject, produces warning', () => {
  // When
  insertOneHandler({}, {});

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_INSERT_ONE action was ignored because the payload was not an instance of a ReduxObject.',
    ),
  ).toBe(true);
});

describe('given defined state', () => {
  test('if given payload is undefined, returns given state object', () => {
    // Given
    const state = {};

    // When
    const updatedState = insertOneHandler(state);

    // Then
    expect(updatedState).toBe(state);
  });

  test('if given payload is not an instance of ReduxObject, returns given state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = insertOneHandler(existingState, {});

    // Then
    expect(updatedState).toBe(existingState);
  });

  describe('if given payload is an instance of ReduxObject', () => {
    test('returns new state object', () => {
      // Given
      const existingState = {};

      class TestObject extends ReduxObject {}
      const testObject = new TestObject();

      // When
      const updatedState = insertOneHandler(existingState, testObject);

      // Then
      expect(updatedState).not.toBe(existingState);
    });

    describe('and state slice is missing', () => {
      test('creates state slice and inserts object', () => {
        // Given
        class TestObject extends ReduxObject {}
        const testObject = new TestObject();

        // When
        const updatedState = insertOneHandler({}, testObject);

        // Then
        expect(updatedState).toEqual({
          [TestObject.stateSlice]: {
            [testObject.id]: testObject,
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

        const testObject = new TestObject();

        // When
        const updatedState = insertOneHandler(existingState, testObject);

        // Then
        expect(updatedState[TestObject.stateSlice]).not.toBe(
          existingStateSlice,
        );
      });

      test('and object with id does not exist, adds object to state slice', () => {
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

        const testObject = new TestObject();

        // When
        const updatedState = insertOneHandler(existingState, testObject);

        // Then
        expect(updatedState).toEqual({
          [TestObject.stateSlice]: {
            ...existingStateSlice,
            [testObject.id]: testObject,
          },
        });
      });

      test('and object with id does exist, returns state without changes', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingTestObject = new TestObject();
        const existingStateSlice = {
          [existingTestObject.id]: existingTestObject,
        };
        const existingState = {
          [TestObject.stateSlice]: existingStateSlice,
        };

        // When
        const updatedState = insertOneHandler(
          existingState,
          existingTestObject,
        );

        // Then
        expect(updatedState).toBe(existingState);
      });
    });
  });
});
