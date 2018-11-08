import sinon from 'sinon';
import updateSectionHandler from '../../src/reducerActionHandlers/updateSectionHandler';

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
    updateSectionHandler();

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_SECTION action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is undefined, returns empty object', () => {
    // When
    const updatedState = updateSectionHandler();

    // Then
    expect(updatedState).toEqual({});
  });

  test('if state is null, produces warning', () => {
    // When
    updateSectionHandler(null);

    // Then
    expect(
      errorStub.calledWith(
        'Warning: A DRIVER_UPDATE_SECTION action was ignored because the given state was null or undefined.',
      ),
    ).toBe(true);
  });

  test('if state is null, returns empty object', () => {
    // When
    const updatedState = updateSectionHandler(null);

    // Then
    expect(updatedState).toEqual({});
  });

  test('if payload sectionName is undefined, produces warning', () => {
    // When
    updateSectionHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's sectionName was not a string with length > 0.",
      ),
    ).toBe(true);
  });

  test('if payload sectionName is not a string, produces warning', () => {
    // When
    updateSectionHandler({}, { sectionName: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's sectionName was not a string with length > 0.",
      ),
    ).toBe(true);
  });

  test('if payload sectionName is an empty string, produces warning', () => {
    // When
    updateSectionHandler({}, { sectionName: '' });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's sectionName was not a string with length > 0.",
      ),
    ).toBe(true);
  });

  test('if payload update is undefined, produces warning', () => {
    // When
    updateSectionHandler({}, {});

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is null, produces warning', () => {
    // When
    updateSectionHandler({}, { update: null });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  test('if payload update is empty, produces warning', () => {
    // When
    updateSectionHandler({}, { update: {} });

    // Then
    expect(
      errorStub.calledWith(
        "Warning: A DRIVER_UPDATE_SECTION action was ignored because the payload's update was empty or missing.",
      ),
    ).toBe(true);
  });

  describe('given defined state', () => {
    test('if payload sectionName is undefined, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateSectionHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload sectionName is not a string, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateSectionHandler(existingState, {
        sectionName: {},
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload sectionName is an empty string, returns given state', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = updateSectionHandler(existingState, {
        sectionName: '',
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    describe('given sectionName is a populatedString', () => {
      test('if payload update is undefined, returns given state', () => {
        // Given
        const existingState = {};

        // When
        const updatedState = updateSectionHandler(existingState, {
          sectionName: 'section',
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('if payload update is null, returns given state', () => {
        // Given
        const existingState = {};

        // When
        const updatedState = updateSectionHandler(existingState, {
          sectionName: 'section',
          update: null,
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('if payload update is empty object, returns given state', () => {
        // Given
        const existingState = {};

        // When
        const updatedState = updateSectionHandler(existingState, {
          sectionName: 'section',
          update: {},
        });

        // Then
        expect(updatedState).toBe(existingState);
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
