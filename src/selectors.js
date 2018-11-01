import createFindManySelector from './selectorCreation/createFindManySelector';

function find(objectType, filter) {
  return createFindManySelector(objectType, filter);
}

export { find };
