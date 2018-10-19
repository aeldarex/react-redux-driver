import { DRIVER_INSERT_ONE } from './actionTypes';
import ReduxObject from './ReduxObject';

const DispatchDriver = {
  insertOne(item) {
    if (!(item instanceof ReduxObject)) {
      throw new Error(
        `Items inserted using the driver must be an instance of ${
          ReduxObject.name
        }.`,
      );
    }

    return {
      type: DRIVER_INSERT_ONE,
      payload: item,
    };
  },
};

export default DispatchDriver;
