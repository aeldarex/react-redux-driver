import reducer from '../src/reducer';
import { DRIVER_INSERT_ONE } from '../src/actionTypes';
import ReduxObject from '../src/ReduxObject';

test('given undefined state and unhandled action type reducer returns empty object', () => {
  // Given
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(undefined, action);

  // Then
  expect(result).toEqual({});
});

test('given defined state and unhandled action type reducer returns state object', () => {
  // Given
  const state = {};
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(state, action);

  // Then
  expect(result).toBe(state);
});

describe('given undefined state and DRIVER_INSERT_ONE action type', () => {
  test('if object to insert is not of type ReduxObject throws error', () => {
    // Given
    const action = {
      type: DRIVER_INSERT_ONE,
      payload: {},
    };

    // Then
    expect(() => reducer(undefined, action)).toThrowError(
      'Payload for action type DRIVER_INSERT_ONE must be a ReduxObject.',
    );
  });

  test('if object is valid ReduxObject, creates stateSlice and inserts object', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject = new TestObject();
    const action = {
      type: DRIVER_INSERT_ONE,
      payload: testObject,
    };

    // When
    const updatedState = reducer(undefined, action);

    // Then
    expect(updatedState[TestObject.stateSlice][testObject.id]).toBe(testObject);
  });
});

describe('given defined state and DRIVER_INSERT_ONE action type', () => {
  test('if object to insert is not of type ReduxObject throws error', () => {
    // Given
    const action = {
      type: DRIVER_INSERT_ONE,
      payload: {},
    };

    // Then
    expect(() => reducer({}, action)).toThrowError(
      'Payload for action type DRIVER_INSERT_ONE must be a ReduxObject.',
    );
  });

  describe('if object is valid ReduxObject', () => {
    test('returns new state object', () => {
      // Given
      const existingState = {};

      class TestObject extends ReduxObject {}

      const testObject = new TestObject();
      const action = {
        type: DRIVER_INSERT_ONE,
        payload: testObject,
      };

      // When
      const updatedState = reducer(existingState, action);

      // Then
      expect(updatedState).not.toBe(existingState);
    });

    describe('and state slice is missing', () => {
      test('creates state slice and inserts object', () => {
        // Given
        class TestObject extends ReduxObject {}

        const testObject = new TestObject();
        const action = {
          type: DRIVER_INSERT_ONE,
          payload: testObject,
        };

        // When
        const updatedState = reducer({}, action);

        // Then
        expect(updatedState[TestObject.stateSlice][testObject.id]).toBe(
          testObject,
        );
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
        const action = {
          type: DRIVER_INSERT_ONE,
          payload: testObject,
        };

        // When
        const updatedState = reducer(existingState, action);

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
        const action = {
          type: DRIVER_INSERT_ONE,
          payload: testObject,
        };

        // When
        const updatedState = reducer(existingState, action);

        // Then
        expect(updatedState[TestObject.stateSlice]).toEqual({
          ...existingStateSlice,
          [testObject.id]: testObject,
        });
      });

      test('and object with id does exist, throws error', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingTestObject = new TestObject();
        const existingStateSlice = {
          [existingTestObject.id]: existingTestObject,
        };
        const existingState = {
          [TestObject.stateSlice]: existingStateSlice,
        };

        const action = {
          type: DRIVER_INSERT_ONE,
          payload: existingTestObject,
        };

        // Then
        expect(() => reducer(existingState, action)).toThrowError(
          `Cannot insert ${TestObject.name} with id ${
            existingTestObject.id
          } as it already exists in the state.`,
        );
      });
    });
  });
});
