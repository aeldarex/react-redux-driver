import { find } from '../src/selectors';
import {
  insertOne,
  insertMany,
  updateOne,
  deleteOne,
  deleteMany,
} from '../src/driverActions';
import reducer from '../src/reducer';
import ReduxObject from '../src/ReduxObject';

test('inserted objects using insertOne action can be located with access driver find selector', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  let state = {};

  // When
  const action1 = insertOne(testObject1);
  state = reducer(state, action1);

  const action2 = insertOne(testObject2);
  state = reducer(state, action2);

  const selector = find(TestObject);
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
  const action = insertMany([testObject1, testObject2]);
  state = reducer(state, action);

  const selector = find(TestObject);
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
  const insertAction = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteOne(TestObject, { propA: 3 });
  state = reducer(state, deleteAction);

  const selector = find(TestObject);
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
  const insertAction = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteMany(TestObject, { propA: 2 });
  state = reducer(state, deleteAction);

  const selector = find(TestObject);
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
  const action = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, action);

  const selector = find(TestObject, {
    sectionNumber: 1,
    childObj1: { propA: x => x < 30 },
    childObj2: { propB: x => x.includes('cool') },
  });
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});

test('insert objects using insertMany action, then delete one with deleteOne using complex filter, then get all remaining with find', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'hello' });
  const testObject2 = new TestObject(2, { propC: 'goodbye' });
  const testObject3 = new TestObject(3, { propC: 'goodbye' });
  const testObject4 = new TestObject(4, { propC: 'hello' });

  let state = {};

  // When
  const insertAction = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteOne(TestObject, {
    propA: x => x > 1,
    propB: { propC: 'goodbye' },
  });
  state = reducer(state, deleteAction);

  const selector = find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3, testObject4]);
});

test('insert objects using insertMany action, then delete multiple with deleteMany using complex filter, then get all remaining with find', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'hello' });
  const testObject2 = new TestObject(2, { propC: 'goodbye' });
  const testObject3 = new TestObject(3, { propC: 'goodbye' });
  const testObject4 = new TestObject(4, { propC: 'hello' });

  let state = {};

  // When
  const insertAction = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteMany(TestObject, {
    propA: x => x > 1,
    propB: { propC: 'goodbye' },
  });
  state = reducer(state, deleteAction);

  const selector = find(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject4]);
});

test('insert objects using insertMany action, then update one with updateOne using complex filter, then get the updated item with find', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'good afternoon' });
  const testObject2 = new TestObject(2, { propC: 'good afternoon' });
  const testObject3 = new TestObject(3, { propC: 'good afternoon' });

  let state = {};

  // When
  const insertAction = insertMany([testObject1, testObject2, testObject3]);
  state = reducer(state, insertAction);

  const updateAction = updateOne(
    TestObject,
    {
      propA: x => x > 1,
      propB: { propC: 'good afternoon' },
    },
    {
      propA: 4,
      propB: { propC: x => x.concat(' and night') },
    },
  );
  state = reducer(state, updateAction);

  const selector = find(TestObject, { id: testObject2.id });
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects.length).toBe(1);
  expect(locatedObjects[0]).toEqual({
    id: testObject2.id,
    propA: 4,
    propB: {
      propC: 'good afternoon and night',
    },
  });
});
