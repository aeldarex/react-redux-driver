function createFunctionBranch(propertyEntry) {
  const propName = propertyEntry[0];
  const propValue = propertyEntry[1];

  if (typeof propValue === 'function') {
    return (x) => {
      x[propName] = propValue(x[propName]); // eslint-disable-line no-param-reassign
    };
  }
  if (propValue && typeof propValue === 'object') {
    const childrenFunctions = Object.entries(propValue).map(e => createFunctionBranch(e));
    return x => childrenFunctions.forEach(f => f(x[propName]));
  }

  return (x) => {
    x[propName] = propValue; // eslint-disable-line no-param-reassign
  };
}

function createUpdateFunctionTree(update) {
  const entries = Object.entries(update);

  const functionTree = [];
  entries.forEach(e => functionTree.push(createFunctionBranch(e)));

  return x => functionTree.forEach(f => f(x));
}

export default createUpdateFunctionTree;
