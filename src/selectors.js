import {
  createFindManySelector,
  createFindOneSelector,
} from './selectorCreation';

function findOne(objectDefinition, filter) {
  return createFindOneSelector(objectDefinition, filter);
}

function findMany(objectDefinition, filter) {
  return createFindManySelector(objectDefinition, filter);
}

export { findOne, findMany };
