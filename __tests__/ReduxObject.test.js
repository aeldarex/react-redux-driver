import ObjectId from 'bson-objectid';
import ReduxObject from '../src/ReduxObject';

test('stateSlice returns class name + s', () => {
  expect(ReduxObject.stateSlice).toBe(`${ReduxObject.name}s`);
});

describe('constructor', () => {
  test('adds an id field which is an ObjectId', () => {
    // When
    const reduxObject = new ReduxObject();

    // Then
    expect(reduxObject.id).toBeInstanceOf(ObjectId);
  });

  test('adds an id field which is unique', () => {
    // When
    const reduxObject1 = new ReduxObject();
    const reduxObject2 = new ReduxObject();

    // Then
    expect(reduxObject1.id).not.toBe(reduxObject2.id);
  });
});
