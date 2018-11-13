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

export { updateSection };
