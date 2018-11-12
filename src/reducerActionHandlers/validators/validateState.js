import warning from 'warning';

function validateState(state, actionType) {
  const isStateAnObject = state != null && typeof state === 'object';

  warning(
    isStateAnObject,
    `A ${actionType} action was ignored because the given state is not an object.`,
  );

  return isStateAnObject;
}

export default validateState;
