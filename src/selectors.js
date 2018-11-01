import {
  createFindManySelector,
  createFindOneSelector,
} from './selectorCreation';

function findOne(objectType, filter) {
  return createFindOneSelector(objectType, filter);
}

function findMany(objectType, filter) {
  return createFindManySelector(objectType, filter);
}

export { findOne, findMany };
