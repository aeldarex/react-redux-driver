import sinon from 'sinon';
import {
  DRIVER_UPDATE_SECTION,
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../src/actionTypes';
import * as UpdateSectionHandler from '../src/reducerActionHandlers/updateSectionHandler';
import * as InsertOneHandlerModule from '../src/reducerActionHandlers/insertOneHandler';
import * as InsertManyHandlerModule from '../src/reducerActionHandlers/insertManyHandler';
import * as UpdateOneHandlerModule from '../src/reducerActionHandlers/updateOneHandler';
import * as UpdateManyHandlerModule from '../src/reducerActionHandlers/updateManyHandler';
import * as DeleteOneHandlerModule from '../src/reducerActionHandlers/deleteOneHandler';
import * as DeleteManyHandlerModule from '../src/reducerActionHandlers/deleteManyHandler';

let updateSectionHandlerStub;
let insertOneHandlerStub;
let insertManyHandlerStub;
let updateOneHandlerStub;
let updateManyHandlerStub;
let deleteOneHandlerStub;
let deleteManyHandlerStub;
let reducer;

beforeAll(() => {
  updateSectionHandlerStub = sinon.stub(UpdateSectionHandler, 'default');
  insertOneHandlerStub = sinon.stub(InsertOneHandlerModule, 'default');
  insertManyHandlerStub = sinon.stub(InsertManyHandlerModule, 'default');
  updateOneHandlerStub = sinon.stub(UpdateOneHandlerModule, 'default');
  updateManyHandlerStub = sinon.stub(UpdateManyHandlerModule, 'default');
  deleteOneHandlerStub = sinon.stub(DeleteOneHandlerModule, 'default');
  deleteManyHandlerStub = sinon.stub(DeleteManyHandlerModule, 'default');

  // eslint-disable-next-line global-require
  reducer = require('../src/reducer').default;
});

afterEach(() => {
  updateSectionHandlerStub.reset();
  insertOneHandlerStub.reset();
  insertManyHandlerStub.reset();
  updateOneHandlerStub.reset();
  updateManyHandlerStub.reset();
  deleteOneHandlerStub.reset();
  deleteManyHandlerStub.reset();
});

afterAll(() => {
  updateSectionHandlerStub.restore();
  insertOneHandlerStub.restore();
  insertManyHandlerStub.restore();
  updateOneHandlerStub.restore();
  updateManyHandlerStub.restore();
  deleteOneHandlerStub.restore();
  deleteManyHandlerStub.restore();
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

test('given undefined state and DRIVER_UPDATE_SECTION action, calls updateSectionHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  updateSectionHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_UPDATE_SECTION, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_UPDATE_SECTION action, calls updateSectionHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  updateSectionHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_UPDATE_SECTION, payload });

  // Then
  expect(result).toBe(updatedState);
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

test('given undefined state and DRIVER_UPDATE_ONE action, calls updateOneHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  updateOneHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_UPDATE_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_UPDATE_ONE action, calls updateOneHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  updateOneHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_UPDATE_ONE, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given undefined state and DRIVER_UPDATE_MANY action, calls updateManyHandler with empty object for state and given payload', () => {
  // Given
  const payload = {};
  const updatedState = {};

  updateManyHandlerStub
    .withArgs({}, sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(undefined, { type: DRIVER_UPDATE_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});

test('given defined state and DRIVER_UPDATE_MANY action, calls updateManyHandler with given state and payload', () => {
  // Given
  const givenState = {};
  const payload = {};
  const updatedState = {};

  updateManyHandlerStub
    .withArgs(sinon.match.same(givenState), sinon.match.same(payload))
    .returns(updatedState);

  // When
  const result = reducer(givenState, { type: DRIVER_UPDATE_MANY, payload });

  // Then
  expect(result).toBe(updatedState);
});
