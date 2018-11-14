import warning from 'warning';
import createSliceSelector from './createSliceSelector';

function createGetSectionSelector(sectionDefinition) {
  warning(
    sectionDefinition && sectionDefinition.stateSlice,
    'To create a working selector sectionDefinition must have a stateSlice property.',
  );

  const { stateSlice } = sectionDefinition || {};
  return createSliceSelector(stateSlice);
}

export default createGetSectionSelector;
