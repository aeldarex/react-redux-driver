import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterOne } from '../sliceInteraction';
import isPopulatedString from '../utils/isPopulatedString';

const invalidInputsWarning = `A DRIVER_DELETE_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.`;

function deleteOneHandler(state, payload) {
  const { sectionName, filter } = payload || {};
  if (!state || !isPopulatedString(sectionName)) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName];
  if (!isObjectWithOwnProps(currentTable)) {
    return state;
  }

  const itemToDelete = filter
    ? filterOne(currentTable, filter)
    : Object.values(currentTable)[0];

  if (!itemToDelete) {
    return state;
  }

  const { [itemToDelete.id]: _, ...itemsToKeep } = currentTable;

  return {
    ...state,
    [sectionName]: itemsToKeep,
  };
}

export default deleteOneHandler;
