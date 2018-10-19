import AccessDriver from '../src/AccessDriver';
import DispatchDriver from '../src/DispatchDriver';
import reducer from '../src/reducer';
import ReduxObject from '../src/ReduxObject';

test('inserted objects using insertOne action can be located with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  let state = {};

  // When
  const action1 = DispatchDriver.insertOne(testObject1);
  state = reducer(state, action1);

  const action2 = DispatchDriver.insertOne(testObject2);
  state = reducer(state, action2);

  const selector = AccessDriver.find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});

test('inserted objects using insertMany action can be located with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  let state = {};

  // When
  const action = DispatchDriver.insertMany([testObject1, testObject2]);
  state = reducer(state, action);

  const selector = AccessDriver.find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});
