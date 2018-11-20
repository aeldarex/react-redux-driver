import warning from 'warning';
import isObjectWithOwnProps from '../utils/isObjectWithOwnProps';
import isPopulatedString from '../utils/isPopulatedString';
import { updateOne } from '../sliceInteraction';

const invalidInputsWarning = `A DRIVER_UPDATE_SECTION action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an update object property with at least one child property.`;

function updateSectionHandler(state, payload) {
  const { sectionName, update } = payload || {};
  if (
    !state
    || !isPopulatedString(sectionName)
    || !isObjectWithOwnProps(update)
  ) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const currentSection = state[sectionName] ? state[sectionName] : {};
  const newSection = updateOne({ index: 0, object: currentSection }, update);

  if (!newSection) {
    return state;
  }

  return {
    ...state,
    [sectionName]: newSection.object,
  };
}

export default updateSectionHandler;
