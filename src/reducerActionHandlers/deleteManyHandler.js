import warning from 'warning';
import isEmptyObject from '../utils/isEmptyObject';
import isReduxObjectType from '../utils/isReduxObjectType';
import createFilterFunctionList from '../utils/createFilterFunctionList';

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
  if (!currentTable || isEmptyObject(currentTable)) {
    return state;
  }

  let updatedTable;
  if (!filter) {
    updatedTable = {};
  } else {
    const filterFunctions = createFilterFunctionList(filter);

    const allEntries = Object.entries(currentTable);
    const entriesToDelete = allEntries.filter((e) => {
      try {
        return filterFunctions.every(f => f(e[1]));
      } catch (_) {
        return false;
      }
    });

    if (entriesToDelete.length !== 0) {
      const itemsToKeep = { ...currentTable };
      entriesToDelete.forEach(e => delete itemsToKeep[e[0]]);
      updatedTable = itemsToKeep;
    } else {
      return state;
    }
  }

  return {
    ...state,
    [stateSlice]: updatedTable,
  };
}

export default deleteManyHandler;
