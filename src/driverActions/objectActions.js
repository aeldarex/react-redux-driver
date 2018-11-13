import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../actionTypes';

function createInsertPayload(object) {
  if (!object) {
    return { sectionName: '' };
  }

  const { stateSlice } = object.constructor || {};
  const sectionName = stateSlice || '';

  const objectCopy = JSON.parse(JSON.stringify(object));

  return { sectionName, object: objectCopy };
}

function createFilterBasedPayload(objectDefinition, filter, update) {
  const { stateSlice } = objectDefinition || {};
  const sectionName = stateSlice || '';

  return { sectionName, filter, update };
}

function insertOne(object) {
  const payload = createInsertPayload(object);

  return {
    type: DRIVER_INSERT_ONE,
    payload,
  };
}

function insertMany(objects) {
  const payload = Array.isArray(objects)
    ? objects.map(createInsertPayload)
    : [];

  return {
    type: DRIVER_INSERT_MANY,
    payload,
  };
}

function updateOne(objectDefinition, filter, update) {
  const payload = createFilterBasedPayload(objectDefinition, filter, update);

  return {
    type: DRIVER_UPDATE_ONE,
    payload,
  };
}

function updateMany(objectDefinition, filter, update) {
  const payload = createFilterBasedPayload(objectDefinition, filter, update);

  return {
    type: DRIVER_UPDATE_MANY,
    payload,
  };
}

function deleteOne(objectDefinition, filter) {
  const payload = createFilterBasedPayload(objectDefinition, filter);

  return {
    type: DRIVER_DELETE_ONE,
    payload,
  };
}

function deleteMany(objectDefinition, filter) {
  const payload = createFilterBasedPayload(objectDefinition, filter);

  return {
    type: DRIVER_DELETE_MANY,
    payload,
  };
}

export {
  insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany,
};
