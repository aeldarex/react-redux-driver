class ReduxSection {
  static get stateSlice() {
    return this.name;
  }

  static get defaultState() {
    return {};
  }
}

export default ReduxSection;
