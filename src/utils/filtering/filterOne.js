import { createFilterFunctionTree } from '../functionTreeCreation';

function filterOne(table, filter) {
  const functionTree = createFilterFunctionTree(filter);

  const allObjects = Object.values(table);
  return allObjects.find((x) => {
    try {
      return functionTree(x);
    } catch (_) {
      return false;
    }
  });
}

export default filterOne;
