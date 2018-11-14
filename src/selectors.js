import {
  createFindManySelector,
  createFindOneSelector,
  createGetSectionSelector,
} from './selectorCreation';

function findOne(objectDefinition, filter) {
  return createFindOneSelector(objectDefinition, filter);
}

function findMany(objectDefinition, filter) {
  return createFindManySelector(objectDefinition, filter);
}

function getSection(sectionDefinition) {
  return createGetSectionSelector(sectionDefinition);
}

export { findOne, findMany, getSection };
