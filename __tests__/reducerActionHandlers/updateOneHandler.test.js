import sinon from 'sinon';
import updateOneHandler from '../../src/reducerActionHandlers/updateOneHandler';

const invalidInputsWarning = `Warning: A DRIVER_UPDATE_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an update object property with at least one child property.`;

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
    const updatedState = updateOneHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateOneHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    updateOneHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateOneHandler(state);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateOneHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      updateOneHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateOneHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateOneHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        updateOneHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });

      describe('given defined sectionName', () => {
        test('if payload update is missing, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateOneHandler(existingState, {
            sectionName: 'SomeSectionName',
          });

          // Then
          expect(updatedState).toBe(existingState);
        });

        test('if payload update is empty object, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateOneHandler(existingState, {
            sectionName: 'SomeSectionName',
            update: {},
          });

          // Then
          expect(updatedState).toBe(existingState);
        });

        test('if payload update is invalid, publishes warning', () => {
          // Given
          const existingState = {};

          // When
          updateOneHandler(existingState, {
            sectionName: 'SomeSectionName',
          });

          // Then
          expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
        });
      });
    });
  });
});

test('state slice for sectionName is undefined, returns given state', () => {
  // Given
  const existingState = {};

  // When
  const updatedState = updateOneHandler(existingState, {
    sectionName: 'SomeSection',
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice for sectionName is empty, returns given state', () => {
  // Given
  const sectionName = 'SomeSection';
  const existingState = { [sectionName]: {} };

  // When
  const updatedState = updateOneHandler(existingState, {
    sectionName,
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('if no filter specified, updates first object in state slice', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { id: '1a', propA: 1, propB: 10 };
  const object2 = { id: '1b', propA: 2, propB: 20 };
  const existingStateSlice = {
    [object1.id]: object1,
    [object2.id]: object2,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    sectionName,
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState[sectionName][object1.id]).not.toBe(object1);
  expect(updatedState).toEqual({
    [sectionName]: {
      [object1.id]: { ...object1, propA: 5, propB: 20 },
      [object2.id]: object2,
    },
  });
});

test('if objects are found which match filter, updates first matching object', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { id: '1a', propA: 1, propB: 10 };
  const object2 = { id: '1b', propA: 2, propB: 20 };
  const object3 = { id: '1c', propA: 2, propB: 20 };
  const existingStateSlice = {
    [object1.id]: object1,
    [object2.id]: object2,
    [object3.id]: object3,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    sectionName,
    filter: { propA: 2, propB: 20 },
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState[sectionName][object2.id]).not.toBe(object2);
  expect(updatedState).toEqual({
    [sectionName]: {
      [object1.id]: object1,
      [object2.id]: { ...object2, propA: 5, propB: 40 },
      [object3.id]: object3,
    },
  });
});

test('but no matching object, returns given state', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { id: '1a', propA: 1, propB: 10 };
  const object2 = { id: '1b', propA: 2, propB: 20 };
  const existingStateSlice = {
    [object1.id]: object1,
    [object2.id]: object2,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateOneHandler(existingState, {
    sectionName,
    filter: { propA: 3, propB: 30 },
    update: { propA: 5, propB: x => x * 2 },
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
    const sectionName = 'SomeSection';
    const object1 = { id: '1a', propA: 1, propB: 10 };
    const object2 = { id: '1b', propA: 2, propB: 20 };
    const object3 = { id: '1c', propA: 2, propB: 20 };
    const existingStateSlice = {
      [object1.id]: object1,
      [object2.id]: object2,
      [object3.id]: object3,
    };
    const existingState = {
      [sectionName]: existingStateSlice,
    };

    // When
    const updatedState = updateOneHandler(existingState, {
      sectionName,
      filter: { propA: 2, propB: 20 },
      update: { propA: 5, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).toBe(existingState);
  });
});
