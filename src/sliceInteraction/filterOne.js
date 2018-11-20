import { createFilterFunctionTree } from '../functionTreeCreation';

function filterOne(table, filter) {
  const functionTree = createFilterFunctionTree(filter);

  const matchingIndex = table.findIndex((x) => {
    try {
      return functionTree(x);
    } catch (_) {
      return false;
    }
  });

  return matchingIndex !== -1
    ? { index: matchingIndex, object: table[matchingIndex] }
    : undefined;
}

export default filterOne;
