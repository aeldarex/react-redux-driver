import sinon from 'sinon';
import insertOneHandler from '../../src/reducerActionHandlers/insertOneHandler';

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
    insertOneHandler();

    // Then
    expect(
      errorStub.calledWith(
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
      errorStub.calledWith(
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

  test('if payload is missing, produces sectionName warning', () => {
    // When
    insertOneHandler({});

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if payload is missing, produces object warning', () => {
    // When
    insertOneHandler({});

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include an object with an id. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if payload is null, produces sectionName warning', () => {
    // When
    insertOneHandler({}, null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if payload is null, produces object warning', () => {
    // When
    insertOneHandler({}, null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include an object with an id. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if sectionName is missing from payload, produces sectionName warning', () => {
    // When
    insertOneHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if sectionName is not a string in payload, produces sectionName warning', () => {
    // When
    insertOneHandler({}, { sectionName: {} });

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if sectionName is empty string in payload, produces sectionName warning', () => {
    // When
    insertOneHandler({}, { sectionName: '' });

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if object is missing from payload, produces warning', () => {
    // When
    insertOneHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include an object with an id. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
  });

  test('if object in payload does not have an id, produces warning', () => {
    // When
    insertOneHandler({}, { object: {} });

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_INSERT_ONE action was ignored because the payload did not include an object with an id. '
          + 'Did you try do an insert with something that was not an instance of ReduxObject?',
      ),
    ).toBe(true);
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

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertOneHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is not a string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = insertOneHandler(state, { sectionName: {} });

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
