import { DRIVER_UPDATE_SECTION } from '../actionTypes';

function updateSection(sectionName, update) {
  return {
    type: DRIVER_UPDATE_SECTION,
    payload: {
      sectionName,
      update,
    },
  };
}

export { updateSection }; // eslint-disable-line import/prefer-default-export
