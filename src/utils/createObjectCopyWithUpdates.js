import warning from 'warning';

function createObjectCopyWithUpdates(object, updateFunction) {
  const objectCopy = JSON.parse(JSON.stringify(object));
  try {
    updateFunction(objectCopy);
  } catch (e) {
    warning(
      false,
      `Failed to update ${JSON.stringify(
        object,
      )} due to the following error: ${e}`,
    );
    return null;
  }

  return objectCopy;
}

export default createObjectCopyWithUpdates;
