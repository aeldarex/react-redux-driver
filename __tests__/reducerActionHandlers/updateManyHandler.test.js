import sinon from 'sinon';
import updateManyHandler from '../../src/reducerActionHandlers/updateManyHandler';

const invalidInputsWarning = `Warning: A DRIVER_UPDATE_MANY action was ignored because it's inputs did not meet the following criteria:
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
    const updatedState = updateManyHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateManyHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    updateManyHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateManyHandler(state);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateManyHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      updateManyHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateManyHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateManyHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        updateManyHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });

      describe('given defined sectionName', () => {
        test('if payload update is missing, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateManyHandler(existingState, {
            sectionName: 'SomeSectionName',
          });

          // Then
          expect(updatedState).toBe(existingState);
        });

        test('if payload update is empty object, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateManyHandler(existingState, {
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
          updateManyHandler(existingState, {
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
  const updatedState = updateManyHandler(existingState, {
    sectionName: 'SomeSection',
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('state slice for sectionName is empty, returns given state', () => {
  // Given
  const sectionName = 'SomeSection';
  const existingState = { [sectionName]: [] };

  // When
  const updatedState = updateManyHandler(existingState, {
    sectionName,
    update: { propA: 5 },
  });

  // Then
  expect(updatedState).toBe(existingState);
});

test('if no filter specified, updates all objects in state slice', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { propA: 1, propB: 10 };
  const object2 = { propA: 2, propB: 20 };
  const existingStateSlice = [object1, object2];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateManyHandler(existingState, {
    sectionName,
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState[sectionName]).not.toContain(object1);
  expect(updatedState[sectionName]).not.toContain(object2);
  expect(updatedState).toEqual({
    [sectionName]: [
      { ...object1, propA: 5, propB: 20 },
      { ...object2, propA: 5, propB: 40 },
    ],
  });
});

test('if objects are found which match filter, updates all matching objects', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { propA: 1, propB: 10 };
  const object2 = { propA: 2, propB: 20 };
  const object3 = { propA: 2, propB: 30 };
  const existingStateSlice = [object1, object2, object3];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateManyHandler(existingState, {
    sectionName,
    filter: { propA: 2 },
    update: { propA: 5, propB: x => x * 2 },
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState[sectionName]).not.toContain(object2);
  expect(updatedState[sectionName]).not.toContain(object3);
  expect(updatedState).toEqual({
    [sectionName]: [
      object1,
      { ...object2, propA: 5, propB: 40 },
      { ...object3, propA: 5, propB: 60 },
    ],
  });
});

test('but no matching object, returns given state', () => {
  // Given
  const sectionName = 'SomeSection';
  const object1 = { propA: 1, propB: 10 };
  const object2 = { propA: 2, propB: 20 };
  const existingStateSlice = [object1, object2];
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  // When
  const updatedState = updateManyHandler(existingState, {
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

  test('if all objects matching filter fail to update, returns given state', () => {
    // Given
    const sectionName = 'SomeSection';
    const object1 = { propA: 1, propB: 10 };
    const object2 = { propA: 2, propB: 20 };
    const object3 = { propA: 2, propB: 30 };
    const existingStateSlice = [object1, object2, object3];
    const existingState = {
      [sectionName]: existingStateSlice,
    };

    // When
    const updatedState = updateManyHandler(existingState, {
      sectionName,
      filter: { propA: 2 },
      update: { propA: 5, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).toBe(existingState);
  });

  test("if some objects matching filter fail to update, updates only objects that don't fail", () => {
    // Given
    const sectionName = 'SomeSection';
    const object1 = { propA: 1, propB: 10 };
    const object2 = { propA: 2, propB: '20' };
    const object3 = { propA: 2, propB: 30 };
    const existingStateSlice = [object1, object2, object3];
    const existingState = {
      [sectionName]: existingStateSlice,
    };

    // When
    const updatedState = updateManyHandler(existingState, {
      sectionName,
      filter: { propA: 2 },
      update: { propA: 5, propB: x => x.concat('0') },
    });

    // Then
    expect(updatedState).not.toBe(existingState);
    expect(updatedState[sectionName]).not.toBe(existingStateSlice);
    expect(updatedState[sectionName]).not.toContain(object2);
    expect(updatedState).toEqual({
      [sectionName]: [object1, { ...object2, propA: 5, propB: '200' }, object3],
    });
  });
});
