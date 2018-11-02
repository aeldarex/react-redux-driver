import sinon from 'sinon';
import updateMany from '../../src/sliceInteraction/updateMany';

test('creates copy of all objects with updates', () => {
  // Given
  class SomeObject {
    constructor(propA, propB) {
      this.propA = propA;
      this.propB = propB;
    }
  }

  const obj1 = new SomeObject(5, 10);
  const obj2 = new SomeObject(50, 100);
  const update = { propA: 10 };

  // When
  const updatedObjects = updateMany([obj1, obj2], update);

  // Then
  expect(updatedObjects.length).toBe(2);
  expect(updatedObjects).not.toContain(obj1);
  expect(updatedObjects).not.toContain(obj2);
  updatedObjects.forEach(x => expect(x).toBeInstanceOf(SomeObject));
  expect(updatedObjects).toContainEqual({ propA: 10, propB: 10 });
  expect(updatedObjects).toContainEqual({ propA: 10, propB: 100 });
});

describe('when some objects fail to update', () => {
  let errorStub;

  beforeAll(() => {
    errorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    errorStub.reset();
  });

  afterAll(() => {
    errorStub.restore();
  });

  test('the objects which failed to update are not included', () => {
    // Given
    class SomeObject {
      constructor(propA, propB) {
        this.propA = propA;
        this.propB = propB;
      }
    }

    const obj1 = new SomeObject('1', 10);
    const obj2 = new SomeObject(50, 100);
    const update = { propA: x => x.concat('0') };

    // When
    const updatedObjects = updateMany([obj1, obj2], update);

    // Then
    expect(updatedObjects.length).toBe(1);
    expect(updatedObjects).not.toContain(obj1);
    expect(updatedObjects).not.toContain(obj2);
    expect(updatedObjects[0]).toBeInstanceOf(SomeObject);
    expect(updatedObjects[0]).toEqual({ propA: '10', propB: 10 });
  });
});
