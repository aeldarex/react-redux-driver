import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
} from './actionTypes';
import ReduxObject from './ReduxObject';
import isReduxObjectType from './utils/isReduxObjectType';

const DispatchDriver = {
  insertOne(item) {
    if (!(item instanceof ReduxObject)) {
      throw new Error(
        `insertOne only accepts objects which are an instance of ${
          ReduxObject.name
        }.`,
      );
    }

    return {
      type: DRIVER_INSERT_ONE,
      payload: item,
    };
  },

  insertMany(items) {
    if (!Array.isArray(items) || items.some(i => !(i instanceof ReduxObject))) {
      throw new Error(
        `insertMany only accepts arrays of ${ReduxObject.name}s.`,
      );
    }

    return {
      type: DRIVER_INSERT_MANY,
      payload: items,
    };
  },

  deleteOne(objectType, filter) {
    if (!isReduxObjectType(objectType)) {
      throw new Error(
        `deleteOne only accepts object types which extend ${ReduxObject.name}.`,
      );
    }

    return {
      type: DRIVER_DELETE_ONE,
      payload: { objectType, filter },
    };
  },
};

export default DispatchDriver;
