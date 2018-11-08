import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import isPopulatedString from '../utils/isPopulatedString';
import { updateOne } from '../sliceInteraction';

function updateSectionHandler(state, { sectionName, update } = {}) {
  if (
    !state
    || !isPopulatedString(sectionName)
    || !isObjectWithOwnProps(update)
  ) {
    warning(
      state,
      'A DRIVER_UPDATE_SECTION action was ignored because the given state was null or undefined.',
    );
    warning(
      isPopulatedString(sectionName),
      "A DRIVER_UPDATE_SECTION action was ignored because the payload's sectionName was not a string with length > 0.",
    );
    warning(
      isObjectWithOwnProps(update),
      "A DRIVER_UPDATE_SECTION action was ignored because the payload's update was empty or missing.",
    );

    return state || {};
  }

  const currentSection = state[sectionName] ? state[sectionName] : {};
  const newSection = updateOne(currentSection, update);

  if (!newSection) {
    return state;
  }

  return {
    ...state,
    [sectionName]: newSection,
  };
}

export default updateSectionHandler;
