import {
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} from '../../src/driverActions/objectActions';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../../src/actionTypes';

test('insertOne returns DRIVER_INSERT_ONE action with sectionName and object in payload', () => {
  // Given
  const type = DRIVER_INSERT_ONE;
  const sectionName = 'SomeSectionName';
  const object = { propB: 10 };

  // When
  const result = insertOne(sectionName, object);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      object,
    },
  });
});

test('insertMany returns DRIVER_INSERT_MANY action with sectionName and objects in payload', () => {
  // Given
  const type = DRIVER_INSERT_MANY;
  const sectionName = 'SomeSectionName';
  const objects = [{ propB: 10 }, { propB: 15 }];

  // When
  const result = insertMany(sectionName, objects);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      objects,
    },
  });
});

test('updateOne returns DRIVER_UPDATE_ONE action with sectionName, filter, and update in payload', () => {
  // Given
  const type = DRIVER_UPDATE_ONE;
  const sectionName = 'SomeSectionName';
  const filter = { propC: 'abc' };
  const update = { propC: 'abcd' };

  // When
  const result = updateOne(sectionName, filter, update);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      filter,
      update,
    },
  });
});

test('updateMany returns DRIVER_UPDATE_MANY action with sectionName, filter, and update in payload', () => {
  // Given
  const type = DRIVER_UPDATE_MANY;
  const sectionName = 'SomeSectionName';
  const filter = { propC: 'xyz' };
  const update = { propC: 'wxyz' };

  // When
  const result = updateMany(sectionName, filter, update);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      filter,
      update,
    },
  });
});

test('deleteOne returns DRIVER_DELETE_ONE action with sectionName and filter in payload', () => {
  // Given
  const type = DRIVER_DELETE_ONE;
  const sectionName = 'SomeSectionName';
  const filter = { propC: 55 };

  // When
  const result = deleteOne(sectionName, filter);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      filter,
    },
  });
});

test('deleteMany returns DRIVER_DELETE_MANY action with sectionName and filter in payload', () => {
  // Given
  const type = DRIVER_DELETE_MANY;
  const sectionName = 'SomeSectionName';
  const filter = { propC: 55 };

  // When
  const result = deleteMany(sectionName, filter);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      filter,
    },
  });
});
