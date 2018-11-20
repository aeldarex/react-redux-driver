import sinon from 'sinon';
import insertManyHandler from '../../src/reducerActionHandlers/insertManyHandler';

const invalidInputsWarning = `Warning: A DRIVER_INSERT_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an objects property which is an array.`;
const invalidInsertPayloadWarning = `Warning: An object sent as part of a DRIVER_INSERT_MANY action was ignored because it did not meet the following criteria:
- Object must have own properties.`;

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
    const updatedState = insertManyHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = insertManyHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    insertManyHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = insertManyHandler(existingState);

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = insertManyHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      insertManyHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertManyHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertManyHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        insertManyHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });

      describe('given populated sectionName', () => {
        test('if objects is missing from payload, returns given state object', () => {
          // Given
          const state = {};

          // When
          const updatedState = insertManyHandler(state, {
            sectionName: 'SomeSection',
          });

          // Then
          expect(updatedState).toBe(state);
        });

        test('if objects is not an array, returns given state object', () => {
          // Given
          const state = {};

          // When
          const updatedState = insertManyHandler(state, {
            sectionName: 'SomeSection',
            objects: {},
          });

          // Then
          expect(updatedState).toBe(state);
        });

        test('if object is invalid, publishes warning', () => {
          // When
          insertManyHandler({}, { sectionName: 'SomeSection' });

          // Then
          expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
        });
      });
    });
  });
});

describe('invalid objects', () => {
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

  test('given array containing invalid objects, returns given state', () => {
    // Given
    const sectionName = 'SomeSection';
    const existingState = {};

    // When
    const updatedState = insertManyHandler(existingState, {
      sectionName,
      objects: [undefined, {}, null],
    });

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('given array contains invalid insert payloads, publishes warnings', () => {
    // Given
    const sectionName = 'SomeSection';
    const existingState = {};

    // When
    insertManyHandler(existingState, {
      sectionName,
      objects: [undefined, {}, null],
    });

    // Then
    expect(errorStub.callCount).toBe(3);
    expect(errorStub.alwaysCalledWith(invalidInsertPayloadWarning)).toBe(true);
  });

  test('given array contains mixture of valid and invalid payloads, inserts objects from valid payloads', () => {
    // Given
    const existingState = {};
    const sectionName = 'SomeSection';
    const object1 = { propA: 5 };
    const object2 = { propA: 10 };

    // When
    const updatedState = insertManyHandler(existingState, {
      sectionName,
      objects: [undefined, object1, null, object2],
    });

    // Then
    expect(updatedState).toEqual({
      [sectionName]: [object1, object2],
    });
  });
});

test('given array of insert payloads and state slice undefined, creates state slice and inserts objects', () => {
  // Given
  const existingState = {};
  const sectionName = 'SomeSection';
  const object1 = { propA: 5 };
  const object2 = { propA: 10 };

  // When
  const updatedState = insertManyHandler(existingState, {
    sectionName,
    objects: [object1, object2],
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState).toEqual({
    [sectionName]: [object1, object2],
  });
});

test('objects in state slice have different ids than given objects, inserts objects', () => {
  // Given
  const sectionName = 'SomeSection';

  const existingObject = { propA: 5 };
  const existingStateSlice = [existingObject];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  const newObject1 = { propA: 10 };
  const newObject2 = { propA: 15 };

  // When
  const updatedState = insertManyHandler(existingState, {
    sectionName,
    objects: [newObject1, newObject2],
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [sectionName]: [...existingStateSlice, newObject1, newObject2],
  });
});
