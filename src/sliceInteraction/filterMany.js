import { createFilterFunctionTree } from '../functionTreeCreation';

function filterMany(table, filter) {
  const functionTree = createFilterFunctionTree(filter);

  const matchingItems = [];
  table.forEach((x, index) => {
    try {
      if (functionTree(x)) {
        matchingItems.push({ index, object: x });
      }
    } catch (_) {
      // Ignore failures
    }
  });

  return matchingItems;
}

export default filterMany;
