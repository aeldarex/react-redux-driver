import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';

const invalidInputsWarning = `A DRIVER_INSERT_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an object with own properties.`;

function insertOneHandler(state, payload) {
  const { sectionName, object } = payload || {};
  if (
    !state
    || !isPopulatedString(sectionName)
    || !isObjectWithOwnProps(object)
  ) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName];
  const newTable = currentTable ? currentTable.slice() : [];
  newTable.push(object);

  return {
    ...state,
    [sectionName]: newTable,
  };
}

export default insertOneHandler;
