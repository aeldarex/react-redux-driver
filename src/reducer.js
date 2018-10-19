import createReducer from './utils/createReducer';
import ReduxObject from './ReduxObject';
import { DRIVER_INSERT_ONE, DRIVER_INSERT_MANY } from './actionTypes';

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

function insertMany(state, reduxObjects) {
  if (!Array.isArray(reduxObjects)) {
    return state;
  }

  const freshSlices = {};

  reduxObjects.forEach((x) => {
    if (!(x instanceof ReduxObject)) {
      return;
    }

    const { stateSlice } = x.constructor;

    let sliceToUpdate = freshSlices[stateSlice];
    if (!sliceToUpdate) {
      sliceToUpdate = state[stateSlice] ? { ...state[stateSlice] } : {};
      freshSlices[stateSlice] = sliceToUpdate;
    }

    if (!sliceToUpdate[x.id]) {
      sliceToUpdate[x.id] = x;
    }
  });

  return Object.keys(freshSlices).length !== 0
    ? { ...state, ...freshSlices }
    : state;
}

const handlers = {
  [DRIVER_INSERT_ONE]: insertOne,
  [DRIVER_INSERT_MANY]: insertMany,
};

export default createReducer({}, handlers);
