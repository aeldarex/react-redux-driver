import { findOne, findMany, getSection } from '../src/selectors';
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

test('inserted objects using insertOne action can be located with access driver findMany selector', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 10 };
  const testObject2 = { propA: 100 };

  let state = {};

  // When
  const action1 = insertOne(sectionName, testObject1);
  state = reducer(state, action1);

  const action2 = insertOne(sectionName, testObject2);
  state = reducer(state, action2);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});

test('inserted objects using insertMany action can be located with access driver findMany selector', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 10 };
  const testObject2 = { propA: 100 };

  let state = {};

  // When
  const action = insertMany(sectionName, [testObject1, testObject2]);
  state = reducer(state, action);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2]);
});

test('inserted objects using insertMany, then delete one with deleteOne, then get all remaining with access driver findMany selector', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 1 };
  const testObject2 = { propA: 2 };
  const testObject3 = { propA: 3 };
  const testObject4 = { propA: 4 };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteOne(sectionName, { propA: 3 });
  state = reducer(state, deleteAction);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject2, testObject4]);
});

test('inserted objects using insertMany, then delete some with deleteMany, then get all remaining with access driver findMany selector', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 1 };
  const testObject2 = { propA: 2 };
  const testObject3 = { propA: 3 };
  const testObject4 = { propA: 2 };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteMany(sectionName, { propA: 2 });
  state = reducer(state, deleteAction);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3]);
});

test('insert objects using insertMany action, then find specific objects using complex filter with findMany', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = {
    sectionNumber: 1,
    childObj1: { propA: 24 },
    childObj2: { propB: 'cool string' },
  };
  const testObject2 = {
    sectionNumber: 1,
    childObj1: { propA: 15 },
    childObj2: { propB: 'lame string' },
  };
  const testObject3 = {
    sectionNumber: 1,
    childObj1: { propA: 9 },
    childObj2: { propB: 'super cool string' },
  };
  const testObject4 = {
    sectionNumber: 1,
    childObj1: { propA: 28 },
    childObj2: { propB: 'super lame string' },
  };

  let state = {};

  // When
  const action = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, action);

  const selector = findMany(sectionName, {
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
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 1, propB: { propC: 'hello' } };
  const testObject2 = { propA: 2, propB: { propC: 'goodbye' } };
  const testObject3 = { propA: 3, propB: { propC: 'goodbye' } };
  const testObject4 = { propA: 4, propB: { propC: 'hello' } };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteOne(sectionName, {
    propA: x => x > 1,
    propB: { propC: 'goodbye' },
  });
  state = reducer(state, deleteAction);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject3, testObject4]);
});

test('insert objects using insertMany action, then delete multiple with deleteMany using complex filter, then get all remaining with findMany', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = { propA: 1, propB: { propC: 'hello' } };
  const testObject2 = { propA: 2, propB: { propC: 'goodbye' } };
  const testObject3 = { propA: 3, propB: { propC: 'goodbye' } };
  const testObject4 = { propA: 4, propB: { propC: 'hello' } };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const deleteAction = deleteMany(sectionName, {
    propA: x => x > 1,
    propB: { propC: 'goodbye' },
  });
  state = reducer(state, deleteAction);

  const selector = findMany(sectionName);
  const locatedObjects = selector(state);

  // Then
  expect(locatedObjects).toEqual([testObject1, testObject4]);
});

test('insert objects using insertMany action, then update one with updateOne using complex filter, then get the updated item with findOne', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = {
    propA: 1,
    propB: { propC: 'good afternoon' },
  };
  const testObject2 = {
    propA: 2,
    propB: { propC: 'good afternoon' },
  };
  const testObject3 = {
    propA: 3,
    propB: { propC: 'good afternoon' },
  };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
  ]);
  state = reducer(state, insertAction);

  const updateAction = updateOne(
    sectionName,
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

  const selector = findOne(sectionName, { propA: 4 });
  const locatedObject = selector(state);

  // Then
  expect(locatedObject).toEqual({
    propA: 4,
    propB: {
      propC: 'good afternoon and night',
    },
  });
});

test('insert objects using insertMany action, then get an item with findOne', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = {
    propA: 1,
    propB: { propC: 'good morning' },
  };
  const testObject2 = {
    propA: 1,
    propB: { propC: 'good afternoon' },
  };
  const testObject3 = {
    propA: 1,
    propB: { propC: 'good evening' },
  };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
  ]);
  state = reducer(state, insertAction);

  const selector = findOne(sectionName, {
    propA: 1,
    propB: { propC: x => x.includes('afternoon') },
  });
  const locatedObject = selector(state);

  // Then
  expect(locatedObject).toEqual(testObject2);
});

test('insert objects using insertMany action, then update some using updateMany, then get all items with findMany', () => {
  // Given
  const sectionName = 'TestObjects';
  const testObject1 = {
    propA: 1,
    propB: { propC: 'good morning' },
  };
  const testObject2 = {
    propA: 2,
    propB: { propC: 'good afternoon' },
  };
  const testObject3 = {
    propA: 2,
    propB: { propC: 'good evening' },
  };
  const testObject4 = {
    propA: 3,
    propB: { propC: 'good night' },
  };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [
    testObject1,
    testObject2,
    testObject3,
    testObject4,
  ]);
  state = reducer(state, insertAction);

  const updateAction = updateMany(
    sectionName,
    { propA: 2 },
    { propB: { propC: x => x.concat('!') } },
  );
  state = reducer(state, updateAction);

  const selector = findMany(sectionName, {
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
  const sectionName = 'TestObjects';
  const testObject1 = {
    propA: 1,
    propB: { propC: 'good morning' },
  };
  const testObject2 = {
    propA: 2,
    propB: { propC: 'good afternoon' },
  };

  let state = {};

  // When
  const insertAction = insertMany(sectionName, [testObject1, testObject2]);
  state = reducer(state, insertAction);

  const updateAction = updateMany(
    sectionName,
    {},
    { info: { type: 'greeting' } },
  );
  state = reducer(state, updateAction);

  const selector = findMany(sectionName);
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

test('update section of state with updateSection, then use getSection selector to view updates', () => {
  // Given
  const sectionName = 'auth';

  let state = {
    [sectionName]: {
      token: 'someToken',
      userId: 'someId',
    },
  };

  // When
  const updateAction = updateSection(sectionName, { token: 'newToken' });
  state = reducer(state, updateAction);

  const selector = getSection(sectionName);
  const section = selector(state);

  // Then
  expect(section).toEqual({
    token: 'newToken',
    userId: 'someId',
  });
});
