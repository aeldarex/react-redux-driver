import warning from 'warning';
import ReduxObject from '../ReduxObject';

function insertManyHandler(state, reduxObjects) {
  if (!state || !Array.isArray(reduxObjects)) {
    warning(
      state,
      'A DRIVER_INSERT_MANY action was ignored because the given state was null or undefined.',
    );
    warning(
      Array.isArray(reduxObjects),
      'A DRIVER_INSERT_MANY action was ignored because the payload was not an array.',
    );
    return state || {};
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

export default insertManyHandler;
