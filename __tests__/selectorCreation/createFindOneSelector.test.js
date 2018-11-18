import sinon from 'sinon';
import createFindOneSelector from '../../src/selectorCreation/createFindOneSelector';

const invalidParametersWarning = 'Warning: To create a working findOne selector, sectionName must be a string.';

describe('invalid parameters', () => {
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

  test('if sectionName is missing, publishes warning', () => {
    // When
    createFindOneSelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is missing, selector returns undefined', () => {
    // When
    const selector = createFindOneSelector();
    const result = selector({});

    // Then
    expect(result).not.toBeDefined();
  });

  test('if sectionName is not a string, publishes warning', () => {
    // When
    createFindOneSelector(123);

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is not a string, selector returns undefined', () => {
    // When
    const selector = createFindOneSelector(123);
    const result = selector({});

    // Then
    expect(result).not.toBeDefined();
  });
});

test('if filter not specified, selector returns first item in state section', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a' };
  const testObject2 = { id: '1b' };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const selector = createFindOneSelector(sectionName);
  const result = selector(state);

  // Then
  expect(result).toBe(testObject1);
});

test('if filter is null, selector returns first item in state section', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a' };
  const testObject2 = { id: '1b' };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const selector = createFindOneSelector(sectionName, null);
  const result = selector(state);

  // Then
  expect(result).toBe(testObject1);
});

test('if filter is not an object, selector returns first item in state section', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a' };
  const testObject2 = { id: '1b' };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
    },
  };

  // When
  const selector = createFindOneSelector(sectionName, 123);
  const result = selector(state);

  // Then
  expect(result).toBe(testObject1);
});

test('if filter is specified selector returns first item matching filter', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a', propA: 5 };
  const testObject2 = { id: '1b', propA: 10 };
  const testObject3 = { id: '1c', propA: 15 };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindOneSelector(sectionName, { propA: x => x > 5 });
  const result = selector(state);

  // Then
  expect(result).toBe(testObject2);
});

test('if item throws error in filter function tree selector ignores item', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a', propA: '5' };
  const testObject2 = { id: '1b', propA: 10 };
  const testObject3 = { id: '1c', propA: '20' };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindOneSelector(sectionName, {
    propA: x => x.includes('0'),
  });
  const result = selector(state);

  // Then
  expect(result).toEqual(testObject3);
});
