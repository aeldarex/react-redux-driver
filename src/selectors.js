import {
  createFindManySelector,
  createFindOneSelector,
  createGetSectionSelector,
} from './selectorCreation';

function findOne(sectionName, filter) {
  return createFindOneSelector(sectionName, filter);
}

function findMany(sectionName, filter) {
  return createFindManySelector(sectionName, filter);
}

function getSection(sectionName) {
  return createGetSectionSelector(sectionName);
}

export { findOne, findMany, getSection };
