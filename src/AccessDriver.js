import { createSelector } from 'reselect';
import ReduxObject from './ReduxObject';

const allValuesSelector = slice => (slice ? Object.values(slice) : []);

function createSliceSelector(stateSlice) {
  return state => (state[stateSlice] ? state[stateSlice] : {});
}

const AccessDriver = {
  find(objectType) {
    if (!(objectType.prototype instanceof ReduxObject)) {
      throw new Error('objectType must extend ReduxObject.');
    }

    const sliceSelector = createSliceSelector(objectType.stateSlice);
    return createSelector(sliceSelector, allValuesSelector);
  }
};

export default AccessDriver;
