import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../actionTypes';
import ReduxObject from '../ReduxObject';
import isReduxObjectType from '../utils/isReduxObjectType';

function createInsertPayload(reduxObject) {
  if (!(reduxObject instanceof ReduxObject)) {
    return {};
  }

  const sectionName = reduxObject.constructor.stateSlice;
  const object = JSON.parse(JSON.stringify(reduxObject));

  return { sectionName, object };
}

function insertOne(reduxObject) {
  const payload = createInsertPayload(reduxObject);

  return {
    type: DRIVER_INSERT_ONE,
    payload,
  };
}

function insertMany(reduxObjects) {
  const payload = Array.isArray(reduxObjects)
    ? reduxObjects.map(createInsertPayload)
    : [];

  return {
    type: DRIVER_INSERT_MANY,
    payload,
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
  insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany,
};
