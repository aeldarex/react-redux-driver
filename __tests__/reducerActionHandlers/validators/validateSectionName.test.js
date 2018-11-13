import sinon from 'sinon';
import validateSectionName from '../../../src/reducerActionHandlers/validators/validateSectionName';

const ACTION_TYPE = 'SOME_ACTION_TYPE';
const sectionNameWarning = `Warning: A ${ACTION_TYPE} action was ignored because its payload did not contain a sectionName string with length greater than 0.`;

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

test('if sectionName is undefined, publishes sectionName warning', () => {
  // When
  validateSectionName(undefined, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if sectionName is undefined, returns false', () => {
  // When
  const result = validateSectionName(undefined, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if sectionName is null, publishes sectionName warning', () => {
  // When
  validateSectionName(null, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if sectionName is null, returns false', () => {
  // When
  const result = validateSectionName(null, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if sectionName is not a string, publishes sectionName warning', () => {
  // When
  validateSectionName({}, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if sectionName is not a string, returns false', () => {
  // When
  const result = validateSectionName({}, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if sectionName is an empty string, publishes sectionName warning', () => {
  // When
  validateSectionName('', ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if sectionName is an empty string, returns false', () => {
  // When
  const result = validateSectionName('', ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if sectionName is a populated string and object is a defined object with an id, returns true', () => {
  // When
  const result = validateSectionName('someSectionName', ACTION_TYPE);

  // Then
  expect(result).toBe(true);
});
