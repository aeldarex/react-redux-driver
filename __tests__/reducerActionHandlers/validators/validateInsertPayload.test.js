import sinon from 'sinon';
import validateInsertPayload from '../../../src/reducerActionHandlers/validators/validateInsertPayload';

const ACTION_TYPE = 'SOME_ACTION_TYPE';
const validSectionName = 'SomeSectionName';
const validObject = { id: '1a' };
const sectionNameWarning = `Warning: A ${ACTION_TYPE} action was ignored because its payload did not contain a sectionName string with length greater than 0.`;
const objectWarning = `Warning: A ${ACTION_TYPE} action was ignored because it did not contain an object with an id property in the payload.`;

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

test('if payload is undefined, publishes sectionName warning', () => {
  // When
  validateInsertPayload(undefined, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload is undefined, publishes object warning', () => {
  // When
  validateInsertPayload(undefined, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload is undefined, returns false', () => {
  // When
  const result = validateInsertPayload(undefined, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if payload is null, publishes sectionName warning', () => {
  // When
  validateInsertPayload(null, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload is null, publishes object warning', () => {
  // When
  validateInsertPayload(null, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload is null, returns false', () => {
  // When
  const result = validateInsertPayload(null, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if payload sectionName is undefined, publishes sectionName warning', () => {
  // When
  validateInsertPayload({ object: validObject }, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload sectionName is undefined, returns false', () => {
  // When
  const result = validateInsertPayload({ object: validObject }, ACTION_TYPE);

  // Then
  expect(result).toBe(false);
});

test('if payload sectionName is null, publishes sectionName warning', () => {
  // When
  validateInsertPayload(
    { sectionName: null, object: validObject },
    ACTION_TYPE,
  );

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload sectionName is null, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: null, object: validObject },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload sectionName is not a string, publishes sectionName warning', () => {
  // When
  validateInsertPayload({ sectionName: {}, object: validObject }, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload sectionName is not a string, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: {}, object: validObject },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload sectionName is an empty string, publishes sectionName warning', () => {
  // When
  validateInsertPayload({ sectionName: '', object: validObject }, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(sectionNameWarning)).toBe(true);
});

test('if payload sectionName is an empty string, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: '', object: validObject },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload object is undefined, publishes object warning', () => {
  // When
  validateInsertPayload({ sectionName: validSectionName }, ACTION_TYPE);

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload object is undefined, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: validSectionName },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload object is null, publishes object warning', () => {
  // When
  validateInsertPayload(
    { sectionName: validSectionName, object: null },
    ACTION_TYPE,
  );

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload object is null, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: validSectionName, object: null },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload object is not of type object, publishes object warning', () => {
  // When
  validateInsertPayload(
    { sectionName: validSectionName, object: () => {} },
    ACTION_TYPE,
  );

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload object is not of type object, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: validSectionName, object: () => {} },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload object does not have an id, publishes object warning', () => {
  // When
  validateInsertPayload(
    { sectionName: validSectionName, object: {} },
    ACTION_TYPE,
  );

  // Then
  expect(errorStub.calledWith(objectWarning)).toBe(true);
});

test('if payload object is not have an id, returns false', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: validSectionName, object: {} },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(false);
});

test('if payload sectionName is a populated string and object is a defined object with an id, returns true', () => {
  // When
  const result = validateInsertPayload(
    { sectionName: validSectionName, object: validObject },
    ACTION_TYPE,
  );

  // Then
  expect(result).toBe(true);
});
