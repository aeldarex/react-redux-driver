import warning from 'warning';
import isPopulatedString from '../utils/isPopulatedString';
import isObjectWithId from '../utils/isObjectWithId';

const invalidInputsWarning = `A DRIVER_INSERT_MANY action was ignored because it's inputs did not meet the following criteria:
- State must be defined and not null.
- Payload must contain a sectionName string property with length greater than 0.
- Payload must contain an objects property which is an array.`;
const invalidInsertPayloadWarning = `An insert payload sent as part of a DRIVER_INSERT_MANY action was ignored because it did not meet the following criteria:
- Payload must contain an object property with an id.`;

function insertManyHandler(state, payload) {
  const { sectionName, objects } = payload || {};
  if (!state || !isPopulatedString(sectionName) || !Array.isArray(objects)) {
    warning(false, invalidInputsWarning);
    return state || {};
  }

  const freshSlices = {};

  objects.forEach((x) => {
    if (!isObjectWithId(x)) {
      warning(false, invalidInsertPayloadWarning);
      return;
    }

    let sliceToUpdate = freshSlices[sectionName];
    if (!sliceToUpdate) {
      sliceToUpdate = state[sectionName] ? { ...state[sectionName] } : {};
      freshSlices[sectionName] = sliceToUpdate;
    }

    if (!sliceToUpdate[x.id]) {
      sliceToUpdate[x.id] = x;
    }
  });

  return Object.keys(freshSlices).length !== 0
    ? { ...state, ...freshSlices }
    : state;
}

export default insertManyHandler;
