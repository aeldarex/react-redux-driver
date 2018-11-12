import sinon from 'sinon';
import validateState from '../../../src/reducerActionHandlers/validators/validateState';

const ACTION_TYPE = 'SOME_ACTION_TYPE';
const stateWarning = `Warning: A ${ACTION_TYPE} action was ignored because the given state is not an object.`;

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

test('if state is undefined, publishes warning', () => {
  // When
  validateState(undefined, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(stateWarning)).toBe(true);
});

test('if state is undefined, returns false', () => {
  // When
  const result = validateState(undefined, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if state is null, publishes warning', () => {
  // When
  validateState(null, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(stateWarning)).toBe(true);
});

test('if state is null, returns false;', () => {
  // When
  const result = validateState(null, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if state is defined but not an object, publishes warning', () => {
  // When
  validateState(() => {}, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(stateWarning)).toBe(true);
});

test('if state is defined but not an object, returns false', () => {
  // When
  const result = validateState(() => {}, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if state is an object, returns true', () => {
  // When
  const result = validateState({}, ACTION_TYPE);

  // Then
  expect(result).toBe(true);
});
