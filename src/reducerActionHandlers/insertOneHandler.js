import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';

function insertOneHandler(state, payload) {
  const { sectionName, object } = payload || {};
  if (!state || !isPopulatedString(sectionName) || !object || !object.id) {
    warning(
      state,
      'A DRIVER_INSERT_ONE action was ignored because the given state was null or undefined.',
    );
    warning(
      isPopulatedString(sectionName),
      'A DRIVER_INSERT_ONE action was ignored because the payload did not include a sectionName. '
        + 'Did you try do an insert with something that was not an instance of ReduxObject?',
    );
    warning(
      object && object.id,
      'A DRIVER_INSERT_ONE action was ignored because the payload did not include an object with an id. '
        + 'Did you try do an insert with something that was not an instance of ReduxObject?',
    );

    return state || {};
  }

  const currentTable = state[sectionName] ? state[sectionName] : {};
  if (currentTable[object.id]) {
    return state;
  }

  const updatedTable = {
    ...currentTable,
    [object.id]: object,
  };

  return {
    ...state,
    [sectionName]: updatedTable,
  };
}

export default insertOneHandler;
