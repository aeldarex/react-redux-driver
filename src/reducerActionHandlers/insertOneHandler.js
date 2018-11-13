import {
  validateState,
  validateSectionName,
  validateObject,
} from './validators';
import { DRIVER_INSERT_ONE } from '../actionTypes';

function allValid(state, sectionName, object) {
  const isStateValid = validateState(state, DRIVER_INSERT_ONE);
  const isSectionNameValid = validateSectionName(
    sectionName,
    DRIVER_INSERT_ONE,
  );
  const isObjectValid = validateObject(object, DRIVER_INSERT_ONE);

  return isStateValid && isSectionNameValid && isObjectValid;
}

function insertOneHandler(state, payload) {
  const { sectionName, object } = payload || {};
  if (!allValid(state, sectionName, object)) {
    return state || {};
  }

  const currentTable = state[sectionName] ? state[sectionName] : {};
  if (currentTable[object.id]) {
    return state;
  }

  const updatedTable = {
    ...currentTable,
    [object.id]: object,
  };

  return {
    ...state,
    [sectionName]: updatedTable,
  };
}

export default insertOneHandler;
