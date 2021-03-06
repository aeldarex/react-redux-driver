import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterMany, updateMany } from '../sliceInteraction';
import isPopulatedString from '../utils/isPopulatedString';

const invalidInputsWarning = `A DRIVER_UPDATE_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an update object property with at least one child property.`;

function updateManyHandler(state, payload) {
  const { sectionName, filter, update } = payload || {};
  if (
    !state
    || !isPopulatedString(sectionName)
    || !isObjectWithOwnProps(update)
  ) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName] || [];
  if (currentTable.length === 0) {
    return state;
  }

  let newItems;
  if (!filter) {
    const itemsToUpdate = currentTable.map((x, index) => ({
      index,
      object: x,
    }));
    newItems = updateMany(itemsToUpdate, update);
  } else {
    const itemsToUpdate = filterMany(currentTable, filter);
    if (itemsToUpdate.length !== 0) {
      newItems = updateMany(itemsToUpdate, update);
    }
  }

  if (!newItems || newItems.length === 0) {
    return state;
  }

  const newTable = currentTable.slice();
  newItems.forEach((e) => {
    const { index, object } = e;
    newTable[index] = object;
  });

  return {
    ...state,
    [sectionName]: newTable,
  };
}

export default updateManyHandler;
