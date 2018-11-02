import warning from 'warning';
import isReduxObjectType from '../utils/isReduxObjectType';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterMany, updateMany } from '../sliceInteraction';

function updateManyHandler(state, { objectType, filter, update } = {}) {
  if (
    !state
    || !isReduxObjectType(objectType)
    || !isObjectWithOwnProps(update)
  ) {
    warning(
      state,
      'A DRIVER_UPDATE_MANY action was ignored because the given state was null or undefined.',
    );
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_UPDATE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
    );
    warning(
      isObjectWithOwnProps(update),
      "A DRIVER_UPDATE_MANY action was ignored because the payload's update was empty or missing.",
    );
    return state || {};
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
  if (!isObjectWithOwnProps(currentTable)) {
    return state;
  }

  let newItems;
  if (!filter) {
    const allItems = Object.values(currentTable);
    newItems = updateMany(allItems, update);
  } else {
    const itemsToUpdate = filterMany(currentTable, filter);
    if (itemsToUpdate.length !== 0) {
      newItems = updateMany(itemsToUpdate, update);
    }
  }

  if (!newItems || newItems.length === 0) {
    return state;
  }

  const newItemTable = {};
  newItems.forEach((i) => {
    newItemTable[i.id] = i;
  });

  return {
    ...state,
    [stateSlice]: { ...currentTable, ...newItemTable },
  };
}

export default updateManyHandler;
