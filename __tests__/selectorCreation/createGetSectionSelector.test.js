import sinon from 'sinon';
import createGetSectionSelector from '../../src/selectorCreation/createGetSectionSelector';

const invalidParametersWarning = 'Warning: To create a working selector sectionDefinition must have a stateSlice property.';

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

  test('if sectionDefinition is missing, publishes warning', () => {
    // When
    createGetSectionSelector();

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionDefinition does not have a stateSlice prop, publishes warning', () => {
    // When
    createGetSectionSelector({});

    // Then
    expect(errorStub.calledWith(invalidParametersWarning)).toBe(true);
  });

  test('if sectionDefinition is missing, selector returns empty object', () => {
    // When
    const selector = createGetSectionSelector();
    const result = selector({});

    // Then
    expect(result).toEqual({});
  });
});

test('if section does not exist, returns empty object', () => {
  // Given
  const sectionDefinition = { stateSlice: 'auth' };

  // When
  const selector = createGetSectionSelector(sectionDefinition);
  const result = selector({});

  // Then
  expect(result).toEqual({});
});

test('if section does exist, returns section object', () => {
  // Given
  const stateSlice = 'auth';
  const sectionDefinition = { stateSlice };

  const section = {};
  const state = {
    [stateSlice]: section,
  };

  // When
  const selector = createGetSectionSelector(sectionDefinition);
  const result = selector(state);

  // Then
  expect(result).toBe(section);
});
