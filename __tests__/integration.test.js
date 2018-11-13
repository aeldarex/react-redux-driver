import { findOne, findMany } from '../src/selectors';
import {
  updateSection,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} from '../src/driverActions';
import reducer from '../src/reducer';
import ReduxObject from '../src/ReduxObject';

test('inserted objects using insertOne action can be located with access driver findMany selector', () => {
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

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});

test('inserted objects using insertMany action can be located with access driver findMany selector', () => {
  // Given
  class TestObject extends ReduxObject {}

  const testObject1 = new TestObject();
  const testObject2 = new TestObject();

  let state = {};

  // When
  const action = insertMany([testObject1, testObject2]);
  state = reducer(state, action);

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});

test('inserted objects using insertMany, then delete one with deleteOne, then get all remaining with access driver findMany selector', () => {
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

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2, testObject4]);
});

test('inserted objects using insertMany, then delete some with deleteMany, then get all remaining with access driver findMany selector', () => {
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

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});

test('insert objects using insertMany action, then find specific objects using complex filter with findMany', () => {
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

  const selector = findMany(TestObject, {
    sectionNumber: 1,
    childObj1: { propA: x => x < 30 },
    childObj2: { propB: x => x.includes('cool') },
  });
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});

test('insert objects using insertMany action, then delete one with deleteOne using complex filter, then get all remaining with findMany', () => {
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

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3, testObject4]);
});

test('insert objects using insertMany action, then delete multiple with deleteMany using complex filter, then get all remaining with findMany', () => {
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

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject4]);
});

test('insert objects using insertMany action, then update one with updateOne using complex filter, then get the updated item with findMany', () => {
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

  const selector = findMany(TestObject, { id: testObject2.id });
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

test('insert objects using insertMany action, then get an item with findOne', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'good morning' });
  const testObject2 = new TestObject(1, { propC: 'good afternoon' });
  const testObject3 = new TestObject(1, { propC: 'good evening' });

  let state = {};

  // When
  const insertAction = insertMany([testObject1, testObject2, testObject3]);
  state = reducer(state, insertAction);

  const selector = findOne(TestObject, {
    propA: 1,
    propB: { propC: x => x.includes('afternoon') },
  });
  const locatedObject = selector(state);

  // Then
  expect(locatedObject).toEqual(testObject2);
});

test('insert objects using insertMany action, then update some using updateMany, then get all items with findMany', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'good morning' });
  const testObject2 = new TestObject(2, { propC: 'good afternoon' });
  const testObject3 = new TestObject(2, { propC: 'good evening' });
  const testObject4 = new TestObject(3, { propC: 'good night' });

  let state = {};

  // When
  const insertAction = insertMany([
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const updateAction = updateMany(
    TestObject,
    { propA: 2 },
    { propB: { propC: x => x.concat('!') } },
  );
  state = reducer(state, updateAction);

  const selector = findMany(TestObject, {
    propB: { propC: x => x.includes('!') },
  });
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects.length).toBe(2);
  expect(locatedObjects).toContainEqual({
    ...testObject2,
    propB: { propC: 'good afternoon!' },
  });
  expect(locatedObjects).toContainEqual({
    ...testObject3,
    propB: { propC: 'good evening!' },
  });
});

test('insert objects using insertMany action, then update all with new nested field using updateMany, then get all items with findMany', () => {
  // Given
  class TestObject extends ReduxObject {
    constructor(propA, propB) {
      super();
      this.propA = propA;
      this.propB = propB;
    }
  }

  const testObject1 = new TestObject(1, { propC: 'good morning' });
  const testObject2 = new TestObject(2, { propC: 'good afternoon' });

  let state = {};

  // When
  const insertAction = insertMany([testObject1, testObject2]);
  state = reducer(state, insertAction);

  const updateAction = updateMany(
    TestObject,
    {},
    { info: { type: 'greeting' } },
  );
  state = reducer(state, updateAction);

  const selector = findMany(TestObject);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects.length).toBe(2);
  expect(locatedObjects).toContainEqual({
    ...testObject1,
    info: { type: 'greeting' },
  });
  expect(locatedObjects).toContainEqual({
    ...testObject2,
    info: { type: 'greeting' },
  });
});

test('update section of state with updateSection, then check state for updates', () => {
  // Given
  let state = {
    auth: {
      token: 'someToken',
      userId: 'someId',
    },
  };

  // When
  const updateAction = updateSection('auth', { token: 'newToken' });
  state = reducer(state, updateAction);

  // Then
  expect(state).toEqual({
    auth: {
      token: 'newToken',
      userId: 'someId',
    },
  });
});
