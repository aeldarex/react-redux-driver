import { DRIVER_UPDATE_SECTION } from '../actionTypes';

function updateSection(sectionDefinition, update) {
  const { stateSlice } = sectionDefinition || {};
  const sectionName = stateSlice || '';

  return {
    type: DRIVER_UPDATE_SECTION,
    payload: {
      sectionName,
      update,
    },
  };
}

function resetSection(sectionDefinition) {
  const { stateSlice, defaultState } = sectionDefinition || {};
  const sectionName = stateSlice || '';
  const update = defaultState || {};

  return {
    type: DRIVER_UPDATE_SECTION,
    payload: {
      sectionName,
      update,
    },
  };
}

export { updateSection, resetSection };
