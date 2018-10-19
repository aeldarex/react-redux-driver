import { createSelector } from 'reselect';
import ReduxObject from './ReduxObject';

const allValuesSelector = slice => (slice ? Object.values(slice) : []);

function createSliceSelector(stateSlice) {
  return state => (state[stateSlice] ? state[stateSlice] : {});
}

const AccessDriver = {
  find(objectType, filter) {
    if (!(objectType.prototype instanceof ReduxObject)) {
      throw new Error('objectType must extend ReduxObject.');
    }

    const sliceSelector = createSliceSelector(objectType.stateSlice);
    let selector = createSelector(sliceSelector, allValuesSelector);

    if (filter) {
      const filterKeys = Object.keys(filter);
      const filterSelector = items => items.filter(i => filterKeys.every(k => i[k] === filter[k]));
      selector = createSelector(selector, filterSelector);
    }

    return selector;
  },
};

export default AccessDriver;
