import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../actionTypes';

function insertOne(sectionName, object) {
  return {
    type: DRIVER_INSERT_ONE,
    payload: {
      sectionName,
      object,
    },
  };
}

function insertMany(sectionName, objects) {
  return {
    type: DRIVER_INSERT_MANY,
    payload: {
      sectionName,
      objects,
    },
  };
}

function updateOne(sectionName, filter, update) {
  return {
    type: DRIVER_UPDATE_ONE,
    payload: {
      sectionName,
      filter,
      update,
    },
  };
}

function updateMany(sectionName, filter, update) {
  return {
    type: DRIVER_UPDATE_MANY,
    payload: {
      sectionName,
      filter,
      update,
    },
  };
}

function deleteOne(sectionName, filter) {
  return {
    type: DRIVER_DELETE_ONE,
    payload: {
      sectionName,
      filter,
    },
  };
}

function deleteMany(sectionName, filter) {
  return {
    type: DRIVER_DELETE_MANY,
    payload: {
      sectionName,
      filter,
    },
  };
}

export {
  insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany,
};
