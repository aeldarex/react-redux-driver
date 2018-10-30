import { createSelector } from 'reselect';
import warning from 'warning';
import isReduxObjectType from './utils/isReduxObjectType';
import createFunctionTree from './utils/createFunctionTree';

const allValuesSelector = slice => (slice ? Object.values(slice) : []);

function createSliceSelector(stateSlice) {
  return state => (state[stateSlice] ? state[stateSlice] : {});
}

const AccessDriver = {
  find(objectType, filter) {
    warning(
      isReduxObjectType(objectType),
      'To create a working selector objectType must extend ReduxObject.',
    );

    const sliceSelector = createSliceSelector(objectType.stateSlice);
    let selector = createSelector(sliceSelector, allValuesSelector);

    if (filter) {
      const filterFunctions = createFunctionTree(filter);

      const filterSelector = items => items.filter((i) => {
        try {
          return filterFunctions.every(f => f(i));
        } catch (e) {
          return false;
        }
      });
      selector = createSelector(selector, filterSelector);
    }

    return selector;
  },
};

export default AccessDriver;
