import { createFilterFunctionTree } from '../../utils/functionTreeCreation';

function filterMany(table, filter) {
  const filterFunctions = createFilterFunctionTree(filter);

  const allObjects = Object.values(table);
  return allObjects.filter((x) => {
    try {
      return filterFunctions.every(f => f(x));
    } catch (_) {
      return false;
    }
  });
}

export default filterMany;
