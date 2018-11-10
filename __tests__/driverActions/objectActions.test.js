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

  test('if given object is not an instance of ReduxObject, returns action with empty payload', () => {
    // Given
    const item = { propA: 5, propB: 'hello' };

    // When
    const result = insertOne(item);

    // Then
    expect(result.payload).toEqual({});
  });

  test('if given object is an instance of ReduxObject, returns action with sectionName and plain copy of object', () => {
    // Given
    class TestObject extends ReduxObject {
      constructor(propA, propB) {
        super();
        this.propA = propA;
        this.propB = propB;
      }
    }

    const item = new TestObject(5, { propC: 'hello' });

    // When
    const result = insertOne(item);

    // Then
    expect(result.payload).toEqual({
      sectionName: TestObject.stateSlice,
      object: {
        id: item.id,
        propA: 5,
        propB: {
          propC: 'hello',
        },
      },
    });
    expect(result.payload.object).not.toBe(item);
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

  test('if given input is an array of ReduxObjects, returns action with payload being an array of object copies and their section names', () => {
    // Given
    class TestObjectA extends ReduxObject {
      constructor(propA, propB) {
        super();
        this.propA = propA;
        this.propB = propB;
      }
    }

    class TestObjectB extends ReduxObject {
      constructor(propC, propD) {
        super();
        this.propC = propC;
        this.propD = propD;
      }
    }

    const item1 = new TestObjectA(5, { propY: 'hello' });
    const item2 = new TestObjectB('goodbye', { propZ: 25 });

    // When
    const result = insertMany([item1, item2]);

    // Then
    expect(result.payload.length).toBe(2);
    expect(result.payload).toContainEqual({
      sectionName: TestObjectA.stateSlice,
      object: {
        id: item1.id,
        propA: 5,
        propB: {
          propY: 'hello',
        },
      },
    });
    expect(result.payload).toContainEqual({
      sectionName: TestObjectB.stateSlice,
      object: {
        id: item2.id,
        propC: 'goodbye',
        propD: {
          propZ: 25,
        },
      },
    });
    expect(result.payload).not.toContain(item1);
    expect(result.payload).not.toContain(item2);
  });
});

describe('updateOne', () => {
  test('returns action with type of DRIVER_UPDATE_ONE', () => {
    // When
    const result = updateOne();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_ONE);
  });

  test('if given objectType does not extend ReduxObject, returns action with payload of empty object', () => {
    // When
    const result = updateOne({}, { propA: 5 }, { propA: 10 });

    // THen
    expect(result.payload).toEqual({});
  });

  test('returns action with payload containing given objectType stateSlice as sectionName, filter, and update objects', () => {
    // Given
    class TestObject extends ReduxObject {}

    // When
    const result = updateOne(TestObject, { propA: 5 }, { propB: 'abc' });

    // Then
    expect(result.payload).toEqual({
      sectionName: TestObject.stateSlice,
      filter: { propA: 5 },
      update: { propB: 'abc' },
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

  test('if given objectType does not extend ReduxObject, returns action with payload of empty object', () => {
    // When
    const result = updateMany({}, { propA: 5 }, { propA: 10 });

    // THen
    expect(result.payload).toEqual({});
  });

  test('returns action with payload containing given objectType stateSlice as sectionName, filter, and update objects', () => {
    // Given
    class TestObject extends ReduxObject {}

    // When
    const result = updateMany(TestObject, { propA: 5 }, { propB: 'abc' });

    // Then
    expect(result.payload).toEqual({
      sectionName: TestObject.stateSlice,
      filter: { propA: 5 },
      update: { propB: 'abc' },
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

  test('if given objectType does not extend ReduxObject, returns action with payload of empty object', () => {
    // When
    const result = deleteOne({}, { propA: 5 });

    // THen
    expect(result.payload).toEqual({});
  });

  test('returns action with payload containing given objectType stateSlice as sectionName and the filter object', () => {
    // Given
    class TestObject extends ReduxObject {}

    // When
    const result = deleteOne(TestObject, { propA: 5 });

    // Then
    expect(result.payload).toEqual({
      sectionName: TestObject.stateSlice,
      filter: { propA: 5 },
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

  test('if given objectType does not extend ReduxObject, returns action with payload of empty object', () => {
    // When
    const result = deleteMany({}, { propA: 5 });

    // THen
    expect(result.payload).toEqual({});
  });

  test('returns action with payload containing given objectType stateSlice as sectionName and the filter object', () => {
    // Given
    class TestObject extends ReduxObject {}

    // When
    const result = deleteMany(TestObject, { propA: 5 });

    // Then
    expect(result.payload).toEqual({
      sectionName: TestObject.stateSlice,
      filter: { propA: 5 },
    });
  });
});
