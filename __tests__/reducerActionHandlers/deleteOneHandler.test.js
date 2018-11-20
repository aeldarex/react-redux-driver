import sinon from 'sinon';
import deleteOneHandler from '../../src/reducerActionHandlers/deleteOneHandler';

const invalidInputsWarning = `Warning: A DRIVER_DELETE_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.`;

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
    const updatedState = deleteOneHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = deleteOneHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    deleteOneHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = deleteOneHandler(state);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = deleteOneHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      deleteOneHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = deleteOneHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = deleteOneHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        deleteOneHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });
    });
  });
});

test('state slice for sectionName is undefined, returns given state', () => {
  // Given
  const existingState = {};

  // When
  const updatedState = deleteOneHandler(existingState, {
    sectionName: 'SomeSectionName',
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice for object is empty, returns given state', () => {
  // Given
  const sectionName = 'SomeSectionName';
  const existingState = { [sectionName]: [] };

  // When
  const updatedState = deleteOneHandler(existingState, {
    sectionName,
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice populated and filter is undefined, deletes first object in state slice', () => {
  // Given
  const sectionName = 'SomeSectionName';

  const object1 = { propA: 5 };
  const object2 = { propA: 10 };
  const existingStateSlice = [object1, object2];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    sectionName,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({ [sectionName]: [object2] });
});

test('objects exist which match filter, deletes first object matching filter', () => {
  // Given
  const sectionName = 'SomeSectionName';

  const object1 = { propA: 5 };
  const object2 = { propA: 10 };
  const object3 = { propA: 10 };
  const existingStateSlice = [object1, object2, object3];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    sectionName,
    filter: { propA: 10 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [sectionName]: [object1, object3],
  });
});

test('no objects match filter, returns given state', () => {
  // Given
  const sectionName = 'SomeSectionName';

  const object1 = { propA: 5 };
  const object2 = { propA: 10 };
  const object3 = { propA: 15 };
  const existingStateSlice = [object1, object2, object3];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = deleteOneHandler(existingState, {
    sectionName,
    filter: { propA: 20 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});
