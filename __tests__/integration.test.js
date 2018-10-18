import accessDriver from '../src/accessDriver';
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

test('inserted objects using insertOne action can be located with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  let state = {};

  // When
  const action1 = dispatchDriver.insertOne(testObject1);
  state = reducer(state, action1);

  const action2 = dispatchDriver.insertOne(testObject2);
  state = reducer(state, action2);

  const selector = accessDriver.find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});
