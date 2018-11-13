import { createSelector } from 'reselect';
import warning from 'warning';
import { createFilterFunctionTree } from '../functionTreeCreation';
import createSliceSelector from './createSliceSelector';
import allValuesSelector from './basicSelectors/allValuesSelector';

function createFindManySelector(objectDefinition, filter) {
  warning(
    objectDefinition && objectDefinition.stateSlice,
    'To create a working selector objectDefinition must have a stateSlice property.',
  );

  const sliceSelector = createSliceSelector(objectDefinition.stateSlice);
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
