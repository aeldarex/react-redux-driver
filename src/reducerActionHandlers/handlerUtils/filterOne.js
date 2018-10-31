import { createFilterFunctionTree } from '../../utils/functionTreeCreation';

function filterOne(table, filter) {
  const filterFunctions = createFilterFunctionTree(filter);

  const allObjects = Object.values(table);
  return allObjects.find((x) => {
    try {
      return filterFunctions.every(f => f(x));
    } catch (_) {
      return false;
    }
  });
}

export default filterOne;
