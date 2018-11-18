import sinon from 'sinon';
import createFindManySelector from '../../src/selectorCreation/createFindManySelector';

const invalidParametersWarning = 'Warning: To create a working findMany selector, sectionName must be a string.';

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
    createFindManySelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is missing, selector returns empty array', () => {
    // When
    const selector = createFindManySelector();
    const result = selector({});

    // Then
    expect(result).toEqual([]);
  });

  test('if sectionName is not a string, publishes warning', () => {
    // When
    createFindManySelector(123);

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is not a string, selector returns emptyArray', () => {
    // When
    const selector = createFindManySelector(123);
    const result = selector({});

    // Then
    expect(result).toEqual([]);
  });
});

test('if filter not specified selector returns all items in state section', () => {
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
  const selector = createFindManySelector(sectionName);
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject2]);
});

test('if filter is null, selector returns all items in state section', () => {
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
  const selector = createFindManySelector(sectionName, null);
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject2]);
});

test('if filter is not an object, selector returns all items in state section', () => {
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
  const selector = createFindManySelector(sectionName, 123);
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject2]);
});

test('if filter is specified selector returns all items matching filter', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a', propA: 5 };
  const testObject2 = { id: '1b', propA: 10 };
  const testObject3 = { id: '1c', propA: 20 };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindManySelector(sectionName, { propA: x => x > 5 });
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject2, testObject3]);
});

test('if item throws error in filter function tree selector ignores item', () => {
  // Given
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { id: '1a', propA: '10' };
  const testObject2 = { id: '1b', propA: 20 };
  const testObject3 = { id: '1c', propA: '30' };
  const state = {
    [sectionName]: {
      [testObject1.id]: testObject1,
      [testObject2.id]: testObject2,
      [testObject3.id]: testObject3,
    },
  };

  // When
  const selector = createFindManySelector(sectionName, {
    propA: x => x.includes('0'),
  });
  const result = selector(state);

  // Then
  expect(result).toEqual([testObject1, testObject3]);
});
