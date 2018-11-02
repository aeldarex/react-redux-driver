import { createUpdateFunctionTree } from '../functionTreeCreation';
import createObjectCopyWithUpdates from '../utils/createObjectCopyWithUpdates';

function updateMany(objects, update) {
  const functionTree = createUpdateFunctionTree(update);

  const updatedObjects = [];
  objects.forEach((x) => {
    const updatedObject = createObjectCopyWithUpdates(x, functionTree);
    if (updatedObject) {
      updatedObjects.push(updatedObject);
    }
  });
  return updatedObjects;
}

export default updateMany;
