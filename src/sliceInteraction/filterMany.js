import { createFilterFunctionTree } from '../functionTreeCreation';

function filterMany(table, filter) {
  const functionTree = createFilterFunctionTree(filter);

  const allObjects = Object.values(table);
  return allObjects.filter((x) => {
    try {
      return functionTree(x);
    } catch (_) {
      return false;
    }
  });
}

export default filterMany;
