import warning from 'warning';

function validateObject(object, actionType) {
  const isObjectValid = object != null && typeof object === 'object' && object.id != null;

  warning(
    isObjectValid,
    `A ${actionType} action was ignored because its payload did not contain an object with an id.`,
  );

  return isObjectValid;
}

export default validateObject;
