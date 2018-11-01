import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
  DRIVER_UPDATE_ONE,
} from './actionTypes';

function insertOne(item) {
  return {
    type: DRIVER_INSERT_ONE,
    payload: item,
  };
}

function insertMany(items) {
  return {
    type: DRIVER_INSERT_MANY,
    payload: items,
  };
}

function updateOne(objectType, filter, update) {
  return {
    type: DRIVER_UPDATE_ONE,
    payload: { objectType, filter, update },
  };
}

function deleteOne(objectType, filter) {
  return {
    type: DRIVER_DELETE_ONE,
    payload: { objectType, filter },
  };
}

function deleteMany(objectType, filter) {
  return {
    type: DRIVER_DELETE_MANY,
    payload: { objectType, filter },
  };
}

export {
  insertOne, insertMany, updateOne, deleteOne, deleteMany,
};
