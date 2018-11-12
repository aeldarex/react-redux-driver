import warning from 'warning';
import isPopulatedString from '../../utils/isPopulatedString';

function validateInsertPayloadAndPublishWarnings(payload, actionType) {
  const { sectionName, object } = payload || {};
  const isSectionNamePopulated = isPopulatedString(sectionName);
  const isObjectValid = object != null && typeof object === 'object' && object.id != null;

  warning(
    isSectionNamePopulated,
    `A ${actionType} action was ignored because its payload did not contain a sectionName string with length greater than 0.`,
  );

  warning(
    isObjectValid,
    `A ${actionType} action was ignored because it did not contain an object with an id property in the payload.`,
  );

  return isSectionNamePopulated && isObjectValid;
}

export default validateInsertPayloadAndPublishWarnings;
