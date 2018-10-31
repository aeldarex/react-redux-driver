import { createSelector } from 'reselect';
import warning from 'warning';
import isReduxObjectType from '../utils/isReduxObjectType';
import { createFilterFunctionTree } from '../utils/functionTreeCreation';
import createSliceSelector from './createSliceSelector';
import allValuesSelector from './basicSelectors/allValuesSelector';

function createFindManySelector(objectType, filter) {
  warning(
    isReduxObjectType(objectType),
    'To create a working selector objectType must extend ReduxObject.',
  );

  const sliceSelector = createSliceSelector(objectType.stateSlice);
  let selector = createSelector(sliceSelector, allValuesSelector);

  if (filter) {
    const functionTree = createFilterFunctionTree(filter);

    const filterSelector = items => items.filter((i) => {
      try {
        return functionTree(i);
      } catch (e) {
        return false;
      }
    });
    selector = createSelector(selector, filterSelector);
  }

  return selector;
}

export default createFindManySelector;
