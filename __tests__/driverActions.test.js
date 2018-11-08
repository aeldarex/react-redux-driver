import {
  updateSection,
  insertOne,
  insertMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} from '../src/driverActions';
import {
  DRIVER_UPDATE_SECTION,
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_UPDATE_ONE,
  DRIVER_UPDATE_MANY,
  DRIVER_DELETE_ONE,
  DRIVER_DELETE_MANY,
} from '../src/actionTypes';

describe('updateSection', () => {
  test('returns action with type of DRIVER_UPDATE_SECTION', () => {
    // When
    const result = updateSection();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_SECTION);
  });

  test('returns action with payload containing given sectionName', () => {
    // Given
    const sectionName = 'someSection';

    // When
    const result = updateSection(sectionName);

    // Then
    expect(result.payload.sectionName).toBe(sectionName);
  });

  test('returns action with payload containing given update', () => {
    // Given
    const update = {};

    // When
    const result = updateSection('someSection', update);

    // Then
    expect(result.payload.update).toBe(update);
  });
});

describe('insertOne', () => {
  test('returns DRIVER_INSERT_ONE action', () => {
    // When
    const result = insertOne();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_ONE);
  });

  test('returns action with given object as payload', () => {
    // Given
    const item = {};

    // When
    const result = insertOne(item);

    // Then
    expect(result.payload).toBe(item);
  });
});

describe('insertMany', () => {
  test('returns DRIVER_INSERT_MANY action', () => {
    // When
    const result = insertMany();

    // Then
    expect(result.type).toBe(DRIVER_INSERT_MANY);
  });

  test('returns action with given items as payload', () => {
    // Given
    const items = [{}, {}];

    // When
    const result = insertMany(items);

    // Then
    expect(result.payload).toBe(items);
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
