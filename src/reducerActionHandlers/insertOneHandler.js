import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithId from '../utils/isObjectWithId';

const invalidInputsWarning = `A DRIVER_INSERT_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an object property with an id.`;

function insertOneHandler(state, payload) {
  const { sectionName, object } = payload || {};
  if (!state || !isPopulatedString(sectionName) || !isObjectWithId(object)) {
    warning(false, invalidInputsWarning);
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
