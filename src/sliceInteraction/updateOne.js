import { createUpdateFunctionTree } from '../functionTreeCreation';
import createObjectCopyWithUpdates from '../utils/createObjectCopyWithUpdates';

function updateOne(object, update) {
  const functionTree = createUpdateFunctionTree(update);
  return createObjectCopyWithUpdates(object, functionTree);
}

export default updateOne;
