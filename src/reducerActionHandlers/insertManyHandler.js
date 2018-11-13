import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithId from '../utils/isObjectWithId';

const invalidInputsWarning = `A DRIVER_INSERT_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must be an array.`;
const invalidInsertPayloadWarning = `An insert payload sent as part of a DRIVER_INSERT_MANY action was ignored because it did not meet the following criteria:
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an object property with an id.`;

function insertManyHandler(state, insertPayloads) {
  if (!state || !Array.isArray(insertPayloads)) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const freshSlices = {};

  insertPayloads.forEach((x) => {
    const { sectionName, object } = x || {};
    if (!isPopulatedString(sectionName) || !isObjectWithId(object)) {
      warning(false, invalidInsertPayloadWarning);
      return;
    }

    let sliceToUpdate = freshSlices[sectionName];
    if (!sliceToUpdate) {
      sliceToUpdate = state[sectionName] ? { ...state[sectionName] } : {};
      freshSlices[sectionName] = sliceToUpdate;
    }

    if (!sliceToUpdate[object.id]) {
      sliceToUpdate[object.id] = object;
    }
  });

  return Object.keys(freshSlices).length !== 0
    ? { ...state, ...freshSlices }
    : state;
}

export default insertManyHandler;
