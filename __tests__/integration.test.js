import dispatchDriver from '../src/dispatchDriver';
import reducer from '../src/reducer';
import ReduxObject from '../src/ReduxObject';

test('insertOne action created by dispatch driver is processed by reducer', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject = new TestObject();

  // When
  const action = dispatchDriver.insertOne(testObject);
  const updatedState = reducer({}, action);

  // Then
  expect(updatedState[TestObject.stateSlice][testObject.id]).toBe(testObject);
});
