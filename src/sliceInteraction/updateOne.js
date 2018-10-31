import warning from 'warning';
import { createUpdateFunctionTree } from '../functionTreeCreation';

function updateOne(item, update) {
  const functionTree = createUpdateFunctionTree(update);

  const itemCopy = JSON.parse(JSON.stringify(item));
  try {
    functionTree(itemCopy);
  } catch (e) {
    warning(
      false,
      `Failed to update ${JSON.stringify(
        item,
      )} due to the following error: ${e}`,
    );
    return null;
  }

  return Object.assign(new item.constructor(), itemCopy);
}

export default updateOne;
