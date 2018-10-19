import { DRIVER_INSERT_ONE, DRIVER_INSERT_MANY } from './actionTypes';
import ReduxObject from './ReduxObject';

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
};

export default DispatchDriver;
