import ReduxSection from '../src/ReduxSection';

test('stateSlice returns name of class', () => {
  expect(ReduxSection.stateSlice).toBe('ReduxSection');
});

test('defaultState returns empty object', () => {
  expect(ReduxSection.defaultState).toEqual({});
});
