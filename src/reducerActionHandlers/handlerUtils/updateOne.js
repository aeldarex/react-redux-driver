import warning from 'warning';
import { createUpdateFunctionTree } from '../../utils/functionTreeCreation';

function updateOne(item, update) {
  const updateFunctions = createUpdateFunctionTree(update);

  const itemCopy = JSON.parse(JSON.stringify(item));
  try {
    updateFunctions.forEach(f => f(itemCopy));
  } catch (e) {
    warning(
      false,
      `Failed to update ${item.constructor.name} with id ${
        item.id
      } due to the following error: ${e}`,
    );
    return null;
  }

  return Object.assign(new item.constructor(), itemCopy);
}

export default updateOne;
