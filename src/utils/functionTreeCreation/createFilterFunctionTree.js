function createFunctionBranch(propertyEntry) {
  const propName = propertyEntry[0];
  const propValue = propertyEntry[1];

  if (typeof propValue === 'function') {
    return x => propValue(x[propName]);
  }
  if (propValue && typeof propValue === 'object') {
    const childrenFunctions = Object.entries(propValue).map(e => createFunctionBranch(e));
    return x => childrenFunctions.every(f => f(x[propName]));
  }

  return x => x[propName] === propValue;
}

function createFilterFunctionTree(filter) {
  const entries = Object.entries(filter);

  const functionTree = [];
  entries.forEach(e => functionTree.push(createFunctionBranch(e)));

  return functionTree;
}

export default createFilterFunctionTree;
