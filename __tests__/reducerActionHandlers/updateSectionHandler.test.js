import sinon from 'sinon';
import updateSectionHandler from '../../src/reducerActionHandlers/updateSectionHandler';

const invalidInputsWarning = `Warning: A DRIVER_UPDATE_SECTION action was ignored because it's inputs did not meet the following criteria:
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
    const updatedState = updateSectionHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateSectionHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is invalid, publishes warning', () => {
    // When
    updateSectionHandler();

    // Then
    expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload is missing, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateSectionHandler(state);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is null, returns given state object', () => {
      // Given
      const state = {};

      // When
      const updatedState = updateSectionHandler(state, null);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      updateSectionHandler({});

      // Then
      expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
    });

    describe('given defined payload', () => {
      test('if sectionName is missing from payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateSectionHandler(state, {});

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is empty string in payload, returns given state object', () => {
        // Given
        const state = {};

        // When
        const updatedState = updateSectionHandler(state, { sectionName: '' });

        // Then
        expect(updatedState).toBe(state);
      });

      test('if sectionName is invalid, publishes warning', () => {
        // When
        updateSectionHandler({}, {});

        // Then
        expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
      });

      describe('given defined sectionName', () => {
        test('if payload update is missing, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateSectionHandler(existingState, {
            sectionName: 'SomeSectionName',
          });

          // Then
          expect(updatedState).toBe(existingState);
        });

        test('if payload update is empty object, returns given state', () => {
          // Given
          const existingState = {};

          // When
          const updatedState = updateSectionHandler(existingState, {
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
          updateSectionHandler(existingState, {
            sectionName: 'SomeSectionName',
          });

          // Then
          expect(errorStub.calledWith(invalidInputsWarning)).toBe(true);
        });
      });
    });
  });
});

test('state section is undefined, creates state section and adds fields from update', () => {
  // Given
  const sectionName = 'someSection';
  const existingState = {};
  const update = { propA: 5 };

  // When
  const updatedState = updateSectionHandler(existingState, {
    sectionName,
    update,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState).toEqual({
    [sectionName]: {
      propA: 5,
    },
  });
});

test('state section exists, updates fields from update', () => {
  // Given
  const sectionName = 'someSection';
  const existingState = {
    [sectionName]: { propA: 1, propB: 5 },
  };
  const update = { propA: x => x + 1, propC: 10 };

  // When
  const updatedState = updateSectionHandler(existingState, {
    sectionName,
    update,
  });

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingState[sectionName]);
  expect(updatedState).toEqual({
    [sectionName]: {
      propA: 2,
      propB: 5,
      propC: 10,
    },
  });
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

  test('state section exists but update fails, returns given state', () => {
    // Given
    const sectionName = 'someSection';
    const existingState = {
      [sectionName]: { propA: 1, propB: 5 },
    };
    const update = { propA: 10, propC: x => x.concat('!') };

    // When
    const updatedState = updateSectionHandler(existingState, {
      sectionName,
      update,
    });

    // Then
    expect(updatedState).toBe(existingState);
  });
});
