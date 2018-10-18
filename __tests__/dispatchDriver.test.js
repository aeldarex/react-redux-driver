import dispatchDriver from '../src/dispatchDriver';
import { DRIVER_INSERT_ONE } from '../src/actionTypes';

test('insertOne returns DRIVER_INSERT_ONE action', () => {
  // When
  const result = dispatchDriver.insertOne({});

  // Then
  expect(result.type).toBe(DRIVER_INSERT_ONE);
});

test('insertOne returns action with given object as payload', () => {
  // Given
  const expectedPayload = {};

  // When
  const result = dispatchDriver.insertOne(expectedPayload);

  // Then
  expect(result.payload).toBe(expectedPayload);
});
