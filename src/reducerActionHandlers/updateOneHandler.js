import warning from 'warning';
import isReduxObjectType from '../utils/isReduxObjectType';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import createFunctionTree from '../utils/createFunctionTree';

function updateOne(state, { objectType, filter, update } = {}) {
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

  let updatedTable;
  if (!filter) {
    const updateFunctions = createFunctionTree(update);

    const firstItem = Object.values(currentTable)[0];

    const itemCopy = JSON.parse(JSON.stringify(firstItem));
    updateFunctions.forEach(f => f(itemCopy));

    updatedTable = { ...currentTable, [itemCopy.id]: itemCopy };
  } else {
    const filterFunctions = createFunctionTree(filter);

    const allObjects = Object.values(currentTable);
    const objectToUpdate = allObjects.find((x) => {
      try {
        return filterFunctions.every(f => f(x));
      } catch (_) {
        return false;
      }
    });

    if (!objectToUpdate) {
      return state;
    }

    const updateFunctions = createFunctionTree(update);

    const itemCopy = JSON.parse(JSON.stringify(objectToUpdate));
    try {
      updateFunctions.forEach(f => f(itemCopy));
    } catch (e) {
      warning(
        false,
        `Failed to update ${objectToUpdate.constructor.name} with id ${
          itemCopy.id
        } due to the following error: ${e}`,
      );
      return state;
    }

    const newObject = Object.assign(new objectToUpdate.constructor(), itemCopy);
    updatedTable = { ...currentTable, [newObject.id]: newObject };
  }

  return {
    ...state,
    [stateSlice]: updatedTable,
  };
}

export default updateOne;
