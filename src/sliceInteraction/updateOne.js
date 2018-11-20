import { createUpdateFunctionTree } from '../functionTreeCreation';
import createObjectCopyWithUpdates from '../utils/createObjectCopyWithUpdates';

function updateOne(entry, update) {
  const { index, object } = entry;

  const functionTree = createUpdateFunctionTree(update);
  const updatedObject = createObjectCopyWithUpdates(object, functionTree);

  return updatedObject ? { index, object: updatedObject } : undefined;
}

export default updateOne;
