import sinon from 'sinon';
import createGetSectionSelector from '../../src/selectorCreation/createGetSectionSelector';

const invalidParametersWarning = 'Warning: To create a working getSection selector, sectionName must be a string.';

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
    createGetSectionSelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is missing, selector returns empty object', () => {
    // When
    const selector = createGetSectionSelector();
    const result = selector({});

    // Then
    expect(result).toEqual({});
  });

  test('if sectionName is not a string, publishes warning', () => {
    // When
    createGetSectionSelector(123);

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionName is not a string, selector returns empty object', () => {
    // When
    const selector = createGetSectionSelector(123);
    const result = selector({});

    // Then
    expect(result).toEqual({});
  });
});

test('if section does not exist, returns empty object', () => {
  // Given
  const sectionName = 'auth';

  // When
  const selector = createGetSectionSelector(sectionName);
  const result = selector({});

  // Then
  expect(result).toEqual({});
});

test('if section does exist, returns section object', () => {
  // Given
  const sectionName = 'auth';

  const section = {};
  const state = {
    [sectionName]: section,
  };

  // When
  const selector = createGetSectionSelector(sectionName);
  const result = selector(state);

  // Then
  expect(result).toBe(section);
});
