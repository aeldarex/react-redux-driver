import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import isReduxObjectType from '../utils/isReduxObjectType';
import { filterMany } from '../sliceInteraction';

function deleteManyHandler(state, { objectType, filter } = {}) {
  if (!state || !isReduxObjectType(objectType)) {
    warning(
      state,
      'A DRIVER_DELETE_MANY action was ignored because the given state was null or undefined.',
    );
    warning(
      isReduxObjectType(objectType),
      "A DRIVER_DELETE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
    );
    return state || {};
  }

  const { stateSlice } = objectType;
  const currentTable = state[stateSlice];
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
    [stateSlice]: updatedTable,
  };
}

export default deleteManyHandler;
