import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
} from './actionTypes';

const DispatchDriver = {
  insertOne(item) {
    return {
      type: DRIVER_INSERT_ONE,
      payload: item,
    };
  },

  insertMany(items) {
    return {
      type: DRIVER_INSERT_MANY,
      payload: items,
    };
  },

  deleteOne(objectType, filter) {
    return {
      type: DRIVER_DELETE_ONE,
      payload: { objectType, filter },
    };
  },
};

export default DispatchDriver;
