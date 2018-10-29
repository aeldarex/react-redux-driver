import warning from 'warning';
import ReduxObject from '../ReduxObject';

function insertOneHandler(state, reduxObject) {
  if (!state || !(reduxObject instanceof ReduxObject)) {
    warning(
      state,
      'A DRIVER_INSERT_ONE action was ignored because the given state was null or undefined.',
    );
    warning(
      reduxObject instanceof ReduxObject,
      'A DRIVER_INSERT_ONE action was ignored because the payload was not an instance of a ReduxObject.',
    );

    return state || {};
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

export default insertOneHandler;
