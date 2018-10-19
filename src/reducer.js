import createReducer from './utils/createReducer';
import ReduxObject from './ReduxObject';
import { DRIVER_INSERT_ONE } from './actionTypes';

function insertOne(state, reduxObject) {
  if (!(reduxObject instanceof ReduxObject)) {
    return state;
  }

  const { stateSlice } = reduxObject.constructor;
  const currentTable = state[stateSlice] ? state[stateSlice] : {};

  if (currentTable[reduxObject.id]) {
    return state;
  }

  const updatedTable = {
    ...currentTable,
    [reduxObject.id]: reduxObject,
  };

  return {
    ...state,
    [stateSlice]: updatedTable,
  };
}

const handlers = {
  [DRIVER_INSERT_ONE]: insertOne,
};

export default createReducer({}, handlers);
