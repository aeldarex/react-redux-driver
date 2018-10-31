import warning from 'warning';
import isReduxObjectType from '../utils/isReduxObjectType';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import { filterOne, updateOne } from '../sliceInteraction';

function updateOneHandler(state, { objectType, filter, update } = {}) {
  if (
    !state
    || !isReduxObjectType(objectType)
    || !isObjectWithOwnProps(update)
  ) {
    warning(
      state,
      'A DRIVER_UPDATE_ONE action was ignored because the given state was null or undefined.',
    );
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    );
    warning(
      isObjectWithOwnProps(update),
      "A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    );
    return state || {};
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
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
    [stateSlice]: { ...currentTable, [newItem.id]: newItem },
  };
}

export default updateOneHandler;
