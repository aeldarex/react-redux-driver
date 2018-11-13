import warning from 'warning';
import isPopulatedString from '../../utils/isPopulatedString';

function validateSectionName(sectionName, actionType) {
  const isSectionNamePopulated = isPopulatedString(sectionName);

  warning(
    isSectionNamePopulated,
    `A ${actionType} action was ignored because its payload did not contain a sectionName string with length greater than 0.`,
  );

  return isSectionNamePopulated;
}

export default validateSectionName;
