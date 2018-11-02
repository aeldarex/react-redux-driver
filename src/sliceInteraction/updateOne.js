import { createUpdateFunctionTree } from '../functionTreeCreation';
import createObjectCopyWithUpdates from '../utils/createObjectCopyWithUpdates';

function updateOne(item, update) {
  const functionTree = createUpdateFunctionTree(update);
  return createObjectCopyWithUpdates(item, functionTree);
}

export default updateOne;
