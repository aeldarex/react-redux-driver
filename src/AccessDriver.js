import { createSelector } from 'reselect';
import ReduxObject from './ReduxObject';

const allValuesSelector = slice => (slice ? Object.values(slice) : []);

function createSliceSelector(stateSlice) {
  return state => (state[stateSlice] ? state[stateSlice] : {});
}

function createComparisonFunction(propertyEntry) {
  const propName = propertyEntry[0];
  const propValue = propertyEntry[1];

  if (typeof propValue === 'function') {
    return x => propValue(x[propName]);
  }
  if (propValue && typeof propValue === 'object') {
    const childrenFunctions = Object.entries(propValue).map(e => createComparisonFunction(e));
    return x => childrenFunctions.every(f => f(x[propName]));
  }

  return x => x[propName] === propValue;
}

function createFilterFunctionList(filter) {
  const filterEntries = Object.entries(filter);
  const filterFunctionList = [];
  filterEntries.forEach(e => filterFunctionList.push(createComparisonFunction(e)));

  return filterFunctionList;
}

const AccessDriver = {
  find(objectType, filter) {
    if (!(objectType.prototype instanceof ReduxObject)) {
      throw new Error('objectType must extend ReduxObject.');
    }

    const sliceSelector = createSliceSelector(objectType.stateSlice);
    let selector = createSelector(sliceSelector, allValuesSelector);

    if (filter) {
      const filterFunctions = createFilterFunctionList(filter);

      const filterSelector = items => items.filter(i => filterFunctions.every(f => f(i)));
      selector = createSelector(selector, filterSelector);
    }

    return selector;
  },
};

export default AccessDriver;
