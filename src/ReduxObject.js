import ObjectId from 'bson-objectid';

class ReduxObject {
  constructor() {
    this.id = ObjectId().toString();
  }

  static get stateSlice() {
    return this.name.concat('s');
  }
}

export default ReduxObject;
