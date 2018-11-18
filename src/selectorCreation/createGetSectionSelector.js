import warning from 'warning';
import createSliceSelector from './createSliceSelector';

function createGetSectionSelector(sectionName) {
  if (typeof sectionName !== 'string') {
    warning(
      false,
      'To create a working getSection selector, sectionName must be a string.',
    );

    return () => ({});
  }

  return createSliceSelector(sectionName);
}

export default createGetSectionSelector;
