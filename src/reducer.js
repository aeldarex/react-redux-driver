import warning from 'warning';
import createReducer from './utils/createReducer';
import isEmptyObject from './utils/isEmptyObject';
import isReduxObjectType from './utils/isReduxObjectType';
import createFilterFunctionList from './utils/createFilterFunctionList';
import ReduxObject from './ReduxObject';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from './actionTypes';

function insertOne(state, reduxObject) {
  if (!(reduxObject instanceof ReduxObject)) {
    warning(
      false,
      'A DRIVER_INSERT_ONE action was ignored because the payload was not an instance of a ReduxObject.',
    );
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
    warning(
      false,
      'A DRIVER_INSERT_MANY action was ignored because the payload was not an array.',
    );
    return state;
  }

  const freshSlices = {};

  reduxObjects.forEach((x) => {
    if (!(x instanceof ReduxObject)) {
      warning(
        false,
        'An item in a DRIVER_INSERT_MANY action was ignored because it was not an instance of a ReduxObject.',
      );
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
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    );
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
    const filterFunctions = createFilterFunctionList(filter);

    const allEntries = Object.entries(currentTable);
    const entryToDelete = allEntries.find((e) => {
      try {
        return filterFunctions.every(f => f(e[1]));
      } catch (_) {
        return false;
      }
    });

    if (entryToDelete) {
      const { [entryToDelete[0]]: _, ...itemsToKeep } = currentTable;
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

function deleteMany(state, { objectType, filter }) {
  if (isEmptyObject(state) || !isReduxObjectType(objectType)) {
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_DELETE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
    );
    return state;
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
  if (!currentTable || isEmptyObject(currentTable)) {
    return state;
  }

  let updatedTable;
  if (!filter) {
    updatedTable = {};
  } else {
    const filterFunctions = createFilterFunctionList(filter);

    const allEntries = Object.entries(currentTable);
    const entriesToDelete = allEntries.filter((e) => {
      try {
        return filterFunctions.every(f => f(e[1]));
      } catch (_) {
        return false;
      }
    });

    if (entriesToDelete.length !== 0) {
      const itemsToKeep = { ...currentTable };
      entriesToDelete.forEach(e => delete itemsToKeep[e[0]]);
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
  [DRIVER_DELETE_MANY]: deleteMany,
};

export default createReducer({}, handlers);
