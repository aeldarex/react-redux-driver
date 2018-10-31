function createSliceSelector(sliceName) {
  return state => (state[sliceName] ? state[sliceName] : {});
}

export default createSliceSelector;
