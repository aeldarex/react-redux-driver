import {
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} from '../../src/driverActions/objectActions';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../../src/actionTypes';
import ReduxObject from '../../src/ReduxObject';

describe('insertOne', () => {
  test('returns DRIVER_INSERT_ONE action', () => {
    // When
    const result = insertOne();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_ONE);
  });

  test('if given objects constructor does not have a stateSlice string property, returns action with empty sectionName and copy of object', () => {
    // Given
    const object = { propA: 5, propB: 'hello' };

    // When
    const result = insertOne(object);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      object,
    });
    expect(result.payload.object).not.toBe(object);
  });

  test('if given objects constructor does have a stateSlice string property, returns action with stateSlice as sectionName and copy of object', () => {
    // Given
    const stateSlice = 'SomeStateSlice';
    class SomeClass {
      static get stateSlice() {
        return stateSlice;
      }
    }

    const object = new SomeClass();
    object.propA = 5;
    object.propB = 'hello';

    // When
    const result = insertOne(object);

    // Then
    expect(result.payload).toEqual({
      sectionName: stateSlice,
      object,
    });
    expect(result.payload.object).not.toBe(object);
  });
});

describe('insertMany', () => {
  test('returns DRIVER_INSERT_MANY action', () => {
    // When
    const result = insertMany();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_MANY);
  });

  test('if given input is not an array, returns action with payload of empty array', () => {
    // When
    const result = insertMany({});

    // Then
    expect(result.payload).toEqual([]);
  });

  test('if given input is an array of objects, returns action with payload being an array of object copies and their section names', () => {
    // Given
    class SomeClassA {
      static get stateSlice() {
        return 'SomeClassAObjects';
      }
    }
    class SomeClassB {
      static get stateSlice() {
        return 'SomeClassBObjects';
      }
    }

    const object1 = Object.assign(new SomeClassA(), {
      propA: 5,
      propB: 'hello',
    });
    const object2 = Object.assign(new SomeClassB(), {
      propC: 'goodbye',
      propD: 10,
    });
    const object3 = { propE: null, propF: [1, 2, 3] };

    // When
    const result = insertMany([object1, object2, object3]);

    // Then
    expect(result.payload.length).toBe(3);
    expect(result.payload).toContainEqual({
      sectionName: 'SomeClassAObjects',
      object: object1,
    });
    expect(result.payload).toContainEqual({
      sectionName: 'SomeClassBObjects',
      object: object2,
    });
    expect(result.payload).toContainEqual({
      sectionName: '',
      object: object3,
    });

    const objectsInPayload = result.payload.map(i => i.object);
    expect(objectsInPayload).not.toContain(object1);
    expect(objectsInPayload).not.toContain(object2);
    expect(objectsInPayload).not.toContain(object3);
  });
});

describe('updateOne', () => {
  test('returns action with type of DRIVER_UPDATE_ONE', () => {
    // When
    const result = updateOne();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_ONE);
  });

  test('if given objectDefinition does not have a stateSlice string property, returns action with empty sectionName', () => {
    // Given
    const filter = { propA: 5 };
    const update = { propA: 10 };

    // When
    const result = updateOne({}, filter, update);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      filter,
      update,
    });
  });

  test('if given objectDefinition does have a stateSlice string property, returns fully populated payload', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const filter = { propA: 5 };
    const update = { propA: 'abc' };

    // When
    const result = updateOne({ stateSlice: sectionName }, filter, update);

    // Then
    expect(result.payload).toEqual({
      sectionName,
      filter,
      update,
    });
  });
});

describe('updateMany', () => {
  test('returns action with type of DRIVER_UPDATE_MANY', () => {
    // When
    const result = updateMany();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_MANY);
  });

  test('if given objectDefinition does not have a stateSlice string property, returns action with empty sectionName', () => {
    // Given
    const filter = { propA: 5 };
    const update = { propA: 10 };

    // When
    const result = updateMany({}, filter, update);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      filter,
      update,
    });
  });

  test('if given objectDefinition does have a stateSlice string property, returns fully populated payload', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const filter = { propA: 5 };
    const update = { propA: 'abc' };

    // When
    const result = updateMany({ stateSlice: sectionName }, filter, update);

    // Then
    expect(result.payload).toEqual({
      sectionName,
      filter,
      update,
    });
  });
});

describe('deleteOne', () => {
  test('returns action with type of DRIVER_DELETE_ONE', () => {
    // When
    const result = deleteOne();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_ONE);
  });

  test('if given objectDefinition does not have a stateSlice string property, returns action with empty sectionName', () => {
    // Given
    const filter = { propA: 5 };

    // When
    const result = deleteOne({}, filter);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      filter,
    });
  });

  test('if given objectDefinition does have a stateSlice string property, returns fully populated payload', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const filter = { propA: 5 };

    // When
    const result = deleteOne({ stateSlice: sectionName }, filter);

    // Then
    expect(result.payload).toEqual({
      sectionName,
      filter,
    });
  });
});

describe('deleteMany', () => {
  test('returns action with type of DRIVER_DELETE_MANY', () => {
    // When
    const result = deleteMany();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_MANY);
  });

  test('if given objectDefinition does not have a stateSlice string property, returns action with empty sectionName', () => {
    // Given
    const filter = { propA: 5 };

    // When
    const result = deleteMany({}, filter);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      filter,
    });
  });

  test('if given objectDefinition does have a stateSlice string property, returns fully populated payload', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const filter = { propA: 5 };

    // When
    const result = deleteMany({ stateSlice: sectionName }, filter);

    // Then
    expect(result.payload).toEqual({
      sectionName,
      filter,
    });
  });
});
