import sinon from 'sinon';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../src/actionTypes';
import * as InsertOneHandlerModule from '../src/reducerActionHandlers/insertOneHandler';
import * as InsertManyHandlerModule from '../src/reducerActionHandlers/insertManyHandler';
import * as DeleteOneHandlerModule from '../src/reducerActionHandlers/deleteOneHandler';
import * as DeleteManyHandlerModule from '../src/reducerActionHandlers/deleteManyHandler';

let insertOneHandlerStub;
let insertManyHandlerStub;
let deleteOneHandlerStub;
let deleteManyHandlerStub;
let reducer;

beforeAll(() => {
  insertOneHandlerStub = sinon.stub(InsertOneHandlerModule, 'default');
  insertManyHandlerStub = sinon.stub(InsertManyHandlerModule, 'default');
  deleteOneHandlerStub = sinon.stub(DeleteOneHandlerModule, 'default');
  deleteManyHandlerStub = sinon.stub(DeleteManyHandlerModule, 'default');

  // eslint-disable-next-line global-require
  reducer = require('../src/reducer').default;
});

afterEach(() => {
  insertOneHandlerStub.reset();
  insertManyHandlerStub.reset();
  deleteOneHandlerStub.reset();
  deleteManyHandlerStub.reset();
});

test('given undefined state and unhandled action type reducer returns empty object', () => {
  // Given
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(undefined, action);

  // Then
  expect(result).toEqual({});
});

test('given defined state and unhandled action type reducer returns state object', () => {
  // Given
  const state = {};
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(state, action);

  // Then
  expect(result).toBe(state);
});

test('given undefined state and DRIVER_INSERT_ONE action, calls insertOneHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  insertOneHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_INSERT_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_INSERT_ONE action, calls insertOneHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  insertOneHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_INSERT_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given undefined state and DRIVER_INSERT_MANY action, calls insertManyHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  insertManyHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_INSERT_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_INSERT_MANY action, calls insertManyHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  insertManyHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_INSERT_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given undefined state and DRIVER_DELETE_ONE action, calls deleteOneHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  deleteOneHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_DELETE_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_DELETE_ONE action, calls deleteOneHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  deleteOneHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_DELETE_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given undefined state and DRIVER_DELETE_MANY action, calls deleteManyHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  deleteManyHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_DELETE_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_DELETE_MANY action, calls deleteManyHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  deleteManyHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_DELETE_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});
