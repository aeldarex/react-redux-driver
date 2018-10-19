import DispatchDriver from '../src/DispatchDriver';
import { DRIVER_INSERT_ONE } from '../src/actionTypes';
import ReduxObject from '../src/ReduxObject';

test('given object that is not an instance of a ReduxObject insertOne throws error', () => {
  expect(() => DispatchDriver.insertOne({})).toThrowError(
    `Items inserted using the driver must be an instance of ${
      ReduxObject.name
    }.`,
  );
});

describe('given object is an instance of a ReduxObject', () => {
  test('insertOne returns DRIVER_INSERT_ONE action', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject = new TestObject();

    // When
    const result = DispatchDriver.insertOne(testObject);

    // Then
    expect(result.type).toBe(DRIVER_INSERT_ONE);
  });

  test('insertOne returns action with given object as payload', () => {
    // Given
    class TestObject extends ReduxObject {}

    const testObject = new TestObject();

    // When
    const result = DispatchDriver.insertOne(testObject);

    // Then
    expect(result.payload).toBe(testObject);
  });
});
