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

function createFilterBasedPayload(objectType, filter, update) {
  if (!isReduxObjectType(objectType)) {
    return {};
  }

  const sectionName = objectType.stateSlice;

  return { sectionName, filter, update };
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
  const payload = createFilterBasedPayload(objectType, filter, update);

  return {
    type: DRIVER_UPDATE_ONE,
    payload,
  };
}

function updateMany(objectType, filter, update) {
  const payload = createFilterBasedPayload(objectType, filter, update);

  return {
    type: DRIVER_UPDATE_MANY,
    payload,
  };
}

function deleteOne(objectType, filter) {
  const payload = createFilterBasedPayload(objectType, filter);

  return {
    type: DRIVER_DELETE_ONE,
    payload,
  };
}

function deleteMany(objectType, filter) {
  const payload = createFilterBasedPayload(objectType, filter);

  return {
    type: DRIVER_DELETE_MANY,
    payload,
  };
}

export {
  insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany,
};
