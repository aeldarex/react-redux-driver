import DispatchDriver from '../src/DispatchDriver';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
} from '../src/actionTypes';
import ReduxObject from '../src/ReduxObject';

describe('insertOne', () => {
  test('given object that is not an instance of a ReduxObject throws error', () => {
    expect(() => DispatchDriver.insertOne({})).toThrowError(
      `insertOne only accepts objects which are an instance of ${
        ReduxObject.name
      }.`,
    );
  });

  describe('given object which is an instance of a ReduxObject', () => {
    test('returns DRIVER_INSERT_ONE action', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject = new TestObject();

      // When
      const result = DispatchDriver.insertOne(testObject);

      // Then
      expect(result.type).toBe(DRIVER_INSERT_ONE);
    });

    test('returns action with given object as payload', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject = new TestObject();

      // When
      const result = DispatchDriver.insertOne(testObject);

      // Then
      expect(result.payload).toBe(testObject);
    });
  });
});

describe('insertMany', () => {
  test('given object that is not an array throws error', () => {
    expect(() => DispatchDriver.insertMany({})).toThrowError(
      `insertMany only accepts arrays of ${ReduxObject.name}s.`,
    );
  });

  test('given array containing items that are not instances of ReduxObject', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject1 = new TestObject();
    const testObject2 = new TestObject();

    // Then
    expect(() => DispatchDriver.insertMany([testObject1, {}, testObject2])).toThrowError(`insertMany only accepts arrays of ${ReduxObject.name}s.`);
  });

  describe('given object is an array of ReduxObject objects', () => {
    test('returns DRIVER_INSERT_MANY action', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();

      // When
      const result = DispatchDriver.insertMany([testObject1, testObject2]);

      // Then
      expect(result.type).toBe(DRIVER_INSERT_MANY);
    });

    test('returns action with given array of ReduxObject objects as payload', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const objectArray = [testObject1, testObject2];

      // When
      const result = DispatchDriver.insertMany(objectArray);

      // Then
      expect(result.payload).toBe(objectArray);
    });
  });
});

describe('deleteOne', () => {
  test('given undefined objectType, throws error', () => {
    expect(() => DispatchDriver.deleteOne()).toThrowError(
      `deleteOne only accepts object types which extend ${ReduxObject.name}.`,
    );
  });

  test('given null objectType, throws error', () => {
    expect(() => DispatchDriver.deleteOne(null)).toThrowError(
      `deleteOne only accepts object types which extend ${ReduxObject.name}.`,
    );
  });

  test('given objectType which does not extend ReduxObject, throws error', () => {
    expect(() => DispatchDriver.deleteOne({})).toThrowError(
      `deleteOne only accepts object types which extend ${ReduxObject.name}.`,
    );
  });

  describe('given objectType which does extend ReduxObject', () => {
    test('returns action with type of DRIVER_DELETE_ONE', () => {
      // Given
      class TestObject extends ReduxObject {}

      // When
      const result = DispatchDriver.deleteOne(TestObject);

      // Then
      expect(result.type).toBe(DRIVER_DELETE_ONE);
    });

    test('returns action with payload containing given object type', () => {
      // Given
      class TestObject extends ReduxObject {}

      // When
      const result = DispatchDriver.deleteOne(TestObject);

      // Then
      expect(result.payload.objectType).toBe(TestObject);
    });

    test('returns action with payload containing given filter', () => {
      // Given
      class TestObject extends ReduxObject {}

      const filter = {};

      // When
      const result = DispatchDriver.deleteOne(TestObject, filter);

      // Then
      expect(result.payload.filter).toBe(filter);
    });
  });
});
