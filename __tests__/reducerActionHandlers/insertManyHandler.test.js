import sinon from 'sinon';
import insertManyHandler from '../../src/reducerActionHandlers/insertManyHandler';

const invalidPayloadWarning = `Warning: A DRIVER_INSERT_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must be an array.`;
const invalidInsertPayloadWarning = `Warning: An insert payload sent as part of a DRIVER_INSERT_MANY action was ignored because it did not meet the following criteria:
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
    expect(errorStub.calledWith(invalidPayloadWarning)).toBe(true);
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

    test('if given payload is not an array, returns given state object', () => {
      // Given
      const existingState = {};

      // When
      const updatedState = insertManyHandler(existingState, {});

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload is invalid, publishes warning', () => {
      // When
      insertManyHandler({});

      // Then
      expect(errorStub.calledWith(invalidPayloadWarning)).toBe(true);
    });
  });
});

describe('invalid insert payloads', () => {
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

  test('given array contains invalid insert payloads, returns given state', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = insertManyHandler(existingState, [
      {},
      { sectionName: 'SomeSection' },
      null,
      { object: {} },
      { object: { id: '1a' } },
    ]);

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('given array contains invalid insert payloads, publishes warnings', () => {
    // Given
    const existingState = {};

    // When
    insertManyHandler(existingState, [
      {},
      { sectionName: 'SomeSection' },
      null,
      { object: {} },
      { object: { id: '1a' } },
    ]);

    // Then
    expect(errorStub.callCount).toBe(5);
    expect(errorStub.alwaysCalledWith(invalidInsertPayloadWarning)).toBe(true);
  });

  test('given array contains mixture of valid and invalid payloads, inserts objects from valid payloads', () => {
    // Given
    const existingState = {};
    const sectionName = 'ValidSection';
    const object1 = { id: '1b' };
    const object2 = { id: '1c' };

    const validPayload1 = { sectionName, object: object1 };
    const validPayload2 = { sectionName, object: object2 };

    // When
    const updatedState = insertManyHandler(existingState, [
      {},
      { sectionName: 'SomeSection' },
      validPayload1,
      { object: {} },
      { object: { id: '1a' } },
      validPayload2,
    ]);

    // Then
    expect(updatedState).toEqual({
      [sectionName]: {
        [object1.id]: object1,
        [object2.id]: object2,
      },
    });
  });
});

test('given array of insert payloads and state slice undefined, creates state slice and inserts objects', () => {
  // Given
  const existingState = {};
  const sectionName = 'ValidSection';
  const object1 = { id: '1b' };
  const object2 = { id: '1c' };

  // When
  const updatedState = insertManyHandler(existingState, [
    { sectionName, object: object1 },
    { sectionName, object: object2 },
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState).toEqual({
    [sectionName]: {
      [object1.id]: object1,
      [object2.id]: object2,
    },
  });
});

test('objects in state slice have different ids than given objects, inserts objects', () => {
  // Given
  const sectionName = 'ValidSection';

  const existingObject = { id: '1a' };
  const existingStateSlice = {
    [existingObject.id]: existingObject,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  const newObject1 = { id: '1b' };
  const newObject2 = { id: '1c' };

  // When
  const updatedState = insertManyHandler(existingState, [
    { sectionName, object: newObject1 },
    { sectionName, object: newObject2 },
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [sectionName]: {
      ...existingStateSlice,
      [newObject1.id]: newObject1,
      [newObject2.id]: newObject2,
    },
  });
});

test('some objects with ids already exist in state, only adds objects with new ids to state', () => {
  // Given
  const sectionName = 'ValidSection';

  const existingObject = { id: '1a', otherField: 'hello' };
  const existingStateSlice = {
    [existingObject.id]: existingObject,
  };
  const existingState = {
    [sectionName]: existingStateSlice,
  };

  const newObject1 = { id: '1b' };
  const newObject2 = { id: '1a' };

  // When
  const updatedState = insertManyHandler(existingState, [
    { sectionName, object: newObject1 },
    { sectionName, object: newObject2 },
  ]);

  // Then
  expect(updatedState).not.toBe(existingState);
  expect(updatedState[sectionName]).not.toBe(existingStateSlice);
  expect(updatedState).toEqual({
    [sectionName]: {
      ...existingStateSlice,
      [newObject1.id]: newObject1,
    },
  });
});

test('insert payload are for different sections, adds each object to the correct section', () => {
  // Given
  const sectionName1 = 'ValidSectionA';
  const sectionName2 = 'ValidSectionB';

  const existingState = {};

  const newObject1 = { id: '1a' };
  const newObject2 = { id: '1b' };

  // When
  const updatedState = insertManyHandler(existingState, [
    { sectionName: sectionName1, object: newObject1 },
    { sectionName: sectionName2, object: newObject2 },
  ]);

  // Then
  expect(updatedState).toEqual({
    [sectionName1]: {
      [newObject1.id]: newObject1,
    },
    [sectionName2]: {
      [newObject2.id]: newObject2,
    },
  });
});
