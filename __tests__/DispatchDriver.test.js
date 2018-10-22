import DispatchDriver from '../src/DispatchDriver';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
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
