function createComparisonFunction(propertyEntry) {
  const propName = propertyEntry[0];
  const propValue = propertyEntry[1];

  if (typeof propValue === 'function') {
    return x => propValue(x[propName]);
  }
  if (propValue && typeof propValue === 'object') {
    const childrenFunctions = Object.entries(propValue).map(e => createComparisonFunction(e));
    return x => childrenFunctions.every(f => f(x[propName]));
  }

  return x => x[propName] === propValue;
}

function createFunctionTree(object) {
  const entries = Object.entries(object);
  const functionTree = [];
  entries.forEach(e => functionTree.push(createComparisonFunction(e)));

  return functionTree;
}

export default createFunctionTree;
