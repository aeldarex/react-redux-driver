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

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = updateOne(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = updateOne({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });

  test('returns action with payload containing given update', () => {
    // Given
    const update = {};

    // When
    const result = updateOne({}, {}, update);

    // Then
    expect(result.payload.update).toBe(update);
  });
});

describe('updateMany', () => {
  test('returns action with type of DRIVER_UPDATE_MANY', () => {
    // When
    const result = updateMany();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_MANY);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = updateMany(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = updateMany({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });

  test('returns action with payload containing given update', () => {
    // Given
    const update = {};

    // When
    const result = updateMany({}, {}, update);

    // Then
    expect(result.payload.update).toBe(update);
  });
});

describe('deleteOne', () => {
  test('returns action with type of DRIVER_DELETE_ONE', () => {
    // When
    const result = deleteOne();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_ONE);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = deleteOne(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = deleteOne({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });
});

describe('deleteMany', () => {
  test('returns action with type of DRIVER_DELETE_MANY', () => {
    // When
    const result = deleteMany();

    // Then
    expect(result.type).toBe(DRIVER_DELETE_MANY);
  });

  test('returns action with payload containing given object type', () => {
    // Given
    const objectType = {};

    // When
    const result = deleteMany(objectType);

    // Then
    expect(result.payload.objectType).toBe(objectType);
  });

  test('returns action with payload containing given filter', () => {
    // Given
    const filter = {};

    // When
    const result = deleteMany({}, filter);

    // Then
    expect(result.payload.filter).toBe(filter);
  });
});
