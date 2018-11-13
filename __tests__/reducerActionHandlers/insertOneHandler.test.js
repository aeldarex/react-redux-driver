import sinon from 'sinon';
import insertOneHandler from '../../src/reducerActionHandlers/insertOneHandler';

const invalidInputsWarning = `Warning: A DRIVER_INSERT_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an object property with an id.`;

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

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = insertOneHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = insertOneHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    insertOneHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = insertOneHandler(state);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = insertOneHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      insertOneHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertOneHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertOneHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        insertOneHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });

      describe('given populated sectionName', () => {
        test('if object is missing from payload, returns given state object', () => {
          // Given
          const state = {};

          // When
          const updatedState = insertOneHandler(state, {
            sectionName: 'SomeSection',
          });

          // Then
          expect(updatedState).toBe(state);
        });

        test('if object is missing an id in payload, returns given state object', () => {
          // Given
          const state = {};

          // When
          const updatedState = insertOneHandler(state, {
            sectionName: 'SomeSection',
            object: {},
          });

          // Then
          expect(updatedState).toBe(state);
        });

        test('if object is invalid, publishes warning', () => {
          // When
          insertOneHandler({}, { sectionName: 'SomeSection' });

          // Then
          expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
        });
      });
    });
  });
});

test('state slice for sectionName is undefined, creates state slice and inserts given object into state', () => {
  // Given
  const sectionName = 'SomeSection';
  const existingState = {};
  const object = { id: '1a', propA: 5 };

  // When
  const updatedState = insertOneHandler(existingState, {
    sectionName,
    object,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState).toEqual({
    [sectionName]: {
      [object.id]: object,
    },
  });
});

test('object with id does not exist in current state slice, adds object to state slice', () => {
  // Given
  const sectionName = 'SomeSection';

  const existingObject1 = { id: '1a', propA: 1 };
  const existingObject2 = { id: '1b', propA: 2 };
  const existingStateSlice = {
    [existingObject1.id]: existingObject1,
    [existingObject2.id]: existingObject2,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  const newObject = { id: '1c', propA: 3 };

  // When
  const updatedState = insertOneHandler(existingState, {
    sectionName,
    object: newObject,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [sectionName]: {
      ...existingStateSlice,
      [newObject.id]: newObject,
    },
  });
});

test('and object with id does exist, returns state without changes', () => {
  // Given
  const sectionName = 'SomeSection';

  const existingObject1 = { id: '1a', propA: 1 };
  const existingObject2 = { id: '1b', propA: 2 };
  const existingStateSlice = {
    [existingObject1.id]: existingObject1,
    [existingObject2.id]: existingObject2,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = insertOneHandler(existingState, {
    sectionName,
    object: existingObject2,
  });

  // Then
  expect(updatedState).toBe(existingState);
});
