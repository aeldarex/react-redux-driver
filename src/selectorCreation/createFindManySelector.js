import { createSelector } from 'reselect';
import warning from 'warning';
import { createFilterFunctionTree } from '../functionTreeCreation';
import createSliceSelector from './createSliceSelector';
import allValuesSelector from './basicSelectors/allValuesSelector';

function createFindManySelector(sectionName, filter) {
  if (typeof sectionName !== 'string') {
    warning(
      false,
      'To create a working findMany selector, sectionName must be a string.',
    );

    return () => [];
  }

  const sliceSelector = createSliceSelector(sectionName);
  let selector = createSelector(
    sliceSelector,
    allValuesSelector,
  );

  if (filter) {
    const functionTree = createFilterFunctionTree(filter);

    const filterSelector = items => items.filter((i) => {
      try {
        return functionTree(i);
      } catch (e) {
        return false;
      }
    });
    selector = createSelector(
      selector,
      filterSelector,
    );
  }

  return selector;
}

export default createFindManySelector;
