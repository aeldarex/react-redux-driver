import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import isReduxObjectType from '../utils/isReduxObjectType';
import { filterOne } from '../sliceInteraction';

function deleteOneHandler(state, { objectType, filter } = {}) {
  if (!state || !isReduxObjectType(objectType)) {
    warning(
      state,
      'A DRIVER_DELETE_ONE action was ignored because the given state was null or undefined.',
    );
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    );
    return state || {};
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
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
    [stateSlice]: itemsToKeep,
  };
}

export default deleteOneHandler;
