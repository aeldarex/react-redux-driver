import { DRIVER_UPDATE_SECTION } from '../actionTypes';
import isReduxSectionType from '../utils/isReduxSectionType';

function updateSection(sectionType, update) {
  const payload = isReduxSectionType(sectionType)
    ? { sectionName: sectionType.stateSlice, update }
    : {};

  return {
    type: DRIVER_UPDATE_SECTION,
    payload,
  };
}

export { updateSection };
