import createReducer from './utils/createReducer';
import isEmptyObject from './utils/isEmptyObject';
import isReduxObjectType from './utils/isReduxObjectType';
import ReduxObject from './ReduxObject';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
} from './actionTypes';

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

function deleteOne(state, { objectType, filter }) {
  if (isEmptyObject(state) || !isReduxObjectType(objectType)) {
    return state;
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
  if (!currentTable || isEmptyObject(currentTable)) {
    return state;
  }

  let updatedTable;
  if (!filter) {
    const firstItemKey = Object.keys(currentTable)[0];
    const { [firstItemKey]: firstItemValue, ...itemsToKeep } = currentTable;
    updatedTable = itemsToKeep;
  } else {
    const allItems = Object.entries(currentTable);

    const filterKeys = Object.keys(filter);
    const entryToDelete = allItems.find(i => filterKeys.every(k => i[1][k] === filter[k]));

    if (entryToDelete) {
      const { [entryToDelete[0]]: entryValue, ...itemsToKeep } = currentTable;
      updatedTable = itemsToKeep;
    } else {
      return state;
    }
  }

  return {
    ...state,
    [stateSlice]: updatedTable,
  };
}

const handlers = {
  [DRIVER_INSERT_ONE]: insertOne,
  [DRIVER_INSERT_MANY]: insertMany,
  [DRIVER_DELETE_ONE]: deleteOne,
};

export default createReducer({}, handlers);