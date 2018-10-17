import ObjectId from 'bson-objectid';

class ReduxObject {
  constructor() {
    this.id = ObjectId();
  }

  static get stateSlice() {
    return this.name.concat('s');
  }
}

export default ReduxObject;
