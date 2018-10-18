import { DRIVER_INSERT_ONE } from './actionTypes';

const dispatchDriver = {
  insertOne(item) {
    return {
      type: DRIVER_INSERT_ONE,
      payload: item,
    };
  },
};

export default dispatchDriver;
