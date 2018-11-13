import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithId from '../utils/isObjectWithId';

function insertOneHandler(state, payload) {
  const { sectionName, object } = payload || {};
  if (!state || !isPopulatedString(sectionName) || !isObjectWithId(object)) {
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
