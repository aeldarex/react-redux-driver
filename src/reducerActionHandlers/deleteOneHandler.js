import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import isReduxObjectType from '../utils/isReduxObjectType';
import createFunctionTree from '../utils/createFunctionTree';

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

  let updatedTable;
  if (!filter) {
    const firstItemKey = Object.keys(currentTable)[0];
    const { [firstItemKey]: firstItemValue, ...itemsToKeep } = currentTable;
    updatedTable = itemsToKeep;
  } else {
    const filterFunctions = createFunctionTree(filter);

    const allEntries = Object.entries(currentTable);
    const entryToDelete = allEntries.find((e) => {
      try {
        return filterFunctions.every(f => f(e[1]));
      } catch (_) {
        return false;
      }
    });

    if (entryToDelete) {
      const { [entryToDelete[0]]: _, ...itemsToKeep } = currentTable;
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

export default deleteOneHandler;
