import sinon from 'sinon';
import validateObject from '../../../src/reducerActionHandlers/validators/validateObject';

const ACTION_TYPE = 'SOME_ACTION_TYPE';
const objectWarning = `Warning: A ${ACTION_TYPE} action was ignored because its payload did not contain an object with an id.`;

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

test('if object is undefined, publishes object warning', () => {
  // When
  validateObject(undefined, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if object is undefined, returns false', () => {
  // When
  const result = validateObject(undefined, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if object is null, publishes object warning', () => {
  // When
  validateObject(null, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if object is null, returns false', () => {
  // When
  const result = validateObject(null, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if object is not of type object, publishes object warning', () => {
  // When
  validateObject(() => {}, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if object is not of type object, returns false', () => {
  // When
  const result = validateObject(() => {}, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if object does not have an id, publishes object warning', () => {
  // When
  validateObject({}, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if object is not have an id, returns false', () => {
  // When
  const result = validateObject({}, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if object is a defined object with an id, returns true', () => {
  // When
  const result = validateObject({ id: '1a' }, ACTION_TYPE);

  // Then
  expect(result).toBe(true);
});
