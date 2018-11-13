import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterMany } from '../sliceInteraction';
import isPopulatedString from '../utils/isPopulatedString';

const invalidInputsWarning = `A DRIVER_DELETE_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.`;

function deleteManyHandler(state, payload) {
  const { sectionName, filter } = payload || {};
  if (!state || !isPopulatedString(sectionName)) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName];
  if (!isObjectWithOwnProps(currentTable)) {
    return state;
  }

  let updatedTable;
  if (!filter) {
    updatedTable = {};
  } else {
    const itemsToDelete = filterMany(currentTable, filter);

    if (itemsToDelete.length !== 0) {
      updatedTable = { ...currentTable };
      itemsToDelete.forEach(e => delete updatedTable[e.id]);
    }
  }

  if (!updatedTable) {
    return state;
  }

  return {
    ...state,
    [sectionName]: updatedTable,
  };
}

export default deleteManyHandler;
