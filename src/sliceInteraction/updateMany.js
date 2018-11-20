import { createUpdateFunctionTree } from '../functionTreeCreation';
import createObjectCopyWithUpdates from '../utils/createObjectCopyWithUpdates';

function updateMany(entries, update) {
  const functionTree = createUpdateFunctionTree(update);

  const updatedEntries = [];
  entries.forEach((x) => {
    const { index, object } = x;
    const updatedObject = createObjectCopyWithUpdates(object, functionTree);
    if (updatedObject) {
      updatedEntries.push({ index, object: updatedObject });
    }
  });
  return updatedEntries;
}

export default updateMany;
