import DispatchDriver from '../src/DispatchDriver';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../src/actionTypes';

describe('insertOne', () => {
  test('returns DRIVER_INSERT_ONE action', () => {
    // When
    const result = DispatchDriver.insertOne();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_ONE);
  });

  test('returns action with given object as payload', () => {
    // Given
    const item = {};

    // When
    const result = DispatchDriver.insertOne(item);

    // Then
    expect(result.payload).toBe(item);
  });
});

describe('insertMany', () => {
  test('returns DRIVER_INSERT_MANY action', () => {
    // When
    const result = DispatchDriver.insertMany();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_MANY);
  });

  test('returns action with given items as payload', () => {
    // Given
    const items = [{}, {}];

    // When
    const result = DispatchDriver.insertMany(items);

    // Then
    expect(result.payload).toBe(items);
  });
});

describe('updateOne', () => {
  test('returns action with type of DRIVER_UPDATE_ONE', () => {
    // When
    const result = DispatchDriver.updateOne();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_ONE);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = DispatchDriver.updateOne(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = DispatchDriver.updateOne({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });

  test('returns action with payload containing given update', () => {
    // Given
    const update = {};

    // When
    const result = DispatchDriver.updateOne({}, {}, update);

    // Then
    expect(result.payload.update).toBe(update);
  });
});

describe('deleteOne', () => {
  test('returns action with type of DRIVER_DELETE_ONE', () => {
    // When
    const result = DispatchDriver.deleteOne();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_ONE);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = DispatchDriver.deleteOne(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = DispatchDriver.deleteOne({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });
});

describe('deleteMany', () => {
  test('returns action with type of DRIVER_DELETE_MANY', () => {
    // When
    const result = DispatchDriver.deleteMany();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_MANY);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = DispatchDriver.deleteMany(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = DispatchDriver.deleteMany({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });
});
