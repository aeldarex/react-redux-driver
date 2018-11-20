import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';

const invalidInputsWarning = `A DRIVER_INSERT_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an objects property which is an array.`;
const invalidInsertPayloadWarning = `An object sent as part of a DRIVER_INSERT_MANY action was ignored because it did not meet the following criteria:
- Object must have own properties.`;

function insertManyHandler(state, payload) {
  const { sectionName, objects } = payload || {};
  if (!state || !isPopulatedString(sectionName) || !Array.isArray(objects)) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName] || [];
  const newTable = currentTable.length !== 0 ? currentTable.slice() : [];

  objects.forEach((x) => {
    if (!isObjectWithOwnProps(x)) {
      warning(false, invalidInsertPayloadWarning);
      return;
    }

    newTable.push(x);
  });

  return newTable.length !== currentTable.length
    ? { ...state, [sectionName]: newTable }
    : state;
}

export default insertManyHandler;
