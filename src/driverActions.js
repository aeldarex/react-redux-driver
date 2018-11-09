import {
  DRIVER_UPDATE_SECTION,
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from './actionTypes';

function publishAction(type, payload) {
  return { type, payload };
}

function updateSection(sectionName, update) {
  return {
    type: DRIVER_UPDATE_SECTION,
    payload: { sectionName, update },
  };
}

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

function updateMany(objectType, filter, update) {
  return {
    type: DRIVER_UPDATE_MANY,
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
  publishAction,
  updateSection,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
};
