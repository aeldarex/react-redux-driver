import sinon from 'sinon';
import createReducer from '../../src/utils/createReducer';

describe('createReducer returns function which', () => {
  test('returns initial state if given state is undefined and type not found in function map', () => {
    // Given
    const initialState = {};
    const action = {
      type: 'SOME_TYPE',
    };

    const reducer = createReducer(initialState, {});

    // When
    const result = reducer(undefined, action);

    // Then
    expect(result).toBe(initialState);
  });

  test('returns state parameter if given state is defined if type not found in function map', () => {
    // Given
    const state = {};
    const action = {
      type: 'SOME_TYPE',
    };

    const reducer = createReducer({}, {});

    // When
    const result = reducer(state, action);

    // Then
    expect(result).toBe(state);
  });

  test('returns reduced initial state if state is undefined and type is found in function map', () => {
    // Given
    const initialState = {};
    const actionType = 'SOME_TYPE';
    const actionPayload = {};

    const action = {
      type: actionType,
      payload: actionPayload,
    };

    const reducedInitialState = {};

    const reducerFunction = sinon.stub();
    reducerFunction
      .withArgs(sinon.match.same(initialState), sinon.match.same(actionPayload))
      .returns(reducedInitialState);

    const fnMap = {
      [actionType]: reducerFunction,
    };

    const reducer = createReducer(initialState, fnMap);

    // When
    const result = reducer(undefined, action);

    // Then
    expect(result).toBe(reducedInitialState);
  });

  test('returns reduced given state if type is found in function map', () => {
    // Given
    const state = {};
    const actionType = 'SOME_TYPE';
    const actionPayload = {};

    const action = {
      type: actionType,
      payload: actionPayload,
    };

    const reducedGivenState = {};

    const reducerFunction = sinon.stub();
    reducerFunction
      .withArgs(sinon.match.same(state), sinon.match.same(actionPayload))
      .returns(reducedGivenState);

    const fnMap = {
      [actionType]: reducerFunction,
    };

    const reducer = createReducer({}, fnMap);

    // When
    const result = reducer(state, action);

    // Then
    expect(result).toBe(reducedGivenState);
  });
});
