import createReducer from './utils/createReducer';
import ReduxObject from './ReduxObject';
import { DRIVER_INSERT_ONE } from './actionTypes';

function insertOne(state, reduxObject) {
  if (!(reduxObject instanceof ReduxObject)) {
    throw new Error(
      'Payload for action type DRIVER_INSERT_ONE must be a ReduxObject.',
    );
  }

  const { stateSlice } = reduxObject.constructor;
  const currentTable = state[stateSlice] ? state[stateSlice] : {};

  if (currentTable[reduxObject.id]) {
    throw new Error(
      `Cannot insert ${reduxObject.constructor.name} with id ${
        reduxObject.id
      } as it already exists in the state.`,
    );
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
