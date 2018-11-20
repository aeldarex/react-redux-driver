import warning from 'warning';
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

  const currentTable = state[sectionName] || [];
  if (currentTable.length === 0) {
    return state;
  }

  let newTable;
  if (!filter) {
    newTable = [];
  } else {
    const itemsToDelete = filterMany(currentTable, filter);

    if (itemsToDelete.length !== 0) {
      const indexesToDelete = itemsToDelete.reduce(
        (indexTable, nextItem) => ({
          ...indexTable,
          [nextItem.index]: true,
        }),
        {},
      );
      newTable = currentTable.filter((x, index) => !indexesToDelete[index]);
    }
  }

  if (!newTable) {
    return state;
  }

  return {
    ...state,
    [sectionName]: newTable,
  };
}

export default deleteManyHandler;
