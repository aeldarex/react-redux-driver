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

test('inserted objects using insertMany, then delete one with deleteOne, then get all remaining with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(1);
  const testObject2 = new TestObject(2);
  const testObject3 = new TestObject(3);
  const testObject4 = new TestObject(4);

  let state = {};

  // When
  const insertAction = DispatchDriver.insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = DispatchDriver.deleteOne(TestObject, { propA: 3 });
  state = reducer(state, deleteAction);

  const selector = AccessDriver.find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2, testObject4]);
});

test('inserted objects using insertMany, then delete some with deleteMany, then get all remaining with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA) {
      super();
      this.propA = propA;
    }
  }

  const testObject1 = new TestObject(1);
  const testObject2 = new TestObject(2);
  const testObject3 = new TestObject(3);
  const testObject4 = new TestObject(2);

  let state = {};

  // When
  const insertAction = DispatchDriver.insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = DispatchDriver.deleteMany(TestObject, { propA: 2 });
  state = reducer(state, deleteAction);

  const selector = AccessDriver.find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});

test('insert objects using insertMany action, then find specific objects using complex filter with access driver', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(sectionNumber, childObj1, childObj2) {
      super();
      this.sectionNumber = sectionNumber;
      this.childObj1 = childObj1;
      this.childObj2 = childObj2;
    }
  }

  const testObject1 = new TestObject(
    1,
    { propA: 24 },
    { propB: 'cool string' },
  );
  const testObject2 = new TestObject(
    1,
    { propA: 15 },
    { propB: 'lame string' },
  );
  const testObject3 = new TestObject(
    1,
    { propA: 9 },
    { propB: 'super cool string' },
  );
  const testObject4 = new TestObject(
    1,
    { propA: 28 },
    { propB: 'super lame string' },
  );

  let state = {};

  // When
  const action = DispatchDriver.insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, action);

  const selector = AccessDriver.find(TestObject, {
    sectionNumber: 1,
    childObj1: { propA: x => x < 30 },
    childObj2: { propB: x => x.includes('cool') },
  });
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});
