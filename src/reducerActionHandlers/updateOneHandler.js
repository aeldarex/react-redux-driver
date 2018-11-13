import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterOne, updateOne } from '../sliceInteraction';
import isPopulatedString from '../utils/isPopulatedString';

const invalidInputsWarning = `A DRIVER_UPDATE_ONE action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an update object property with at least one child property.`;

function updateOneHandler(state, payload) {
  const { sectionName, filter, update } = payload || {};
  if (
    !state
    || !isPopulatedString(sectionName)
    || !isObjectWithOwnProps(update)
  ) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentTable = state[sectionName];
  if (!isObjectWithOwnProps(currentTable)) {
    return state;
  }

  let newItem;
  if (!filter) {
    const firstItem = Object.values(currentTable)[0];
    newItem = updateOne(firstItem, update);
  } else {
    const itemToUpdate = filterOne(currentTable, filter);
    if (itemToUpdate) {
      newItem = updateOne(itemToUpdate, update);
    }
  }

  if (!newItem) {
    return state;
  }

  return {
    ...state,
    [sectionName]: { ...currentTable, [newItem.id]: newItem },
  };
}

export default updateOneHandler;
