import warning from 'warning';
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

  const currentTable = state[sectionName] || [];
  if (currentTable.length === 0) {
    return state;
  }

  let indexToDelete;
  if (!filter) {
    indexToDelete = 0;
  } else {
    const itemToDelete = filterOne(currentTable, filter);
    if (itemToDelete) {
      indexToDelete = itemToDelete.index;
    }
  }

  if (indexToDelete == null) {
    return state;
  }

  const newTable = currentTable.filter((x, index) => index !== indexToDelete);

  return {
    ...state,
    [sectionName]: newTable,
  };
}

export default deleteOneHandler;
