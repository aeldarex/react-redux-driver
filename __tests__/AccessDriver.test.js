import sinon from 'sinon';
import AccessDriver from '../src/AccessDriver';
import ReduxObject from '../src/ReduxObject';

let warningStub;

beforeEach(() => {
  warningStub = sinon.stub(console, 'error');
});

afterEach(() => {
  warningStub.restore();
});

describe('find', () => {
  test('if object type does not extend ReduxObject throws error', () => {
    expect(() => AccessDriver.find({})).toThrowError(
      'objectType must extend ReduxObject.',
    );
  });

  describe('if object type extends ReduxObject returns selector which', () => {
    test('yields empty list if state slice for object does not exist', () => {
      // Given
      class TestObject extends ReduxObject {}

      // When
      const selector = AccessDriver.find(TestObject);
      const result = selector({});

      // Then
      expect(result).toEqual([]);
    });

    test('if no filter object specfied gets all objects of type', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject);
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject1, testObject2]);
    });

    test('if filter object is specified with primitive, gets objects which match filter object with strict equality', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject, { id: testObject2.id });
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject2]);
    });

    test('if filter object is specified with function, gets objects which match filter object by satisfying function', () => {
      // Given
      class TestObject extends ReduxObject {
        constructor(propA) {
          super();
          this.propA = propA;
        }
      }

      const testObject1 = new TestObject(10);
      const testObject2 = new TestObject(40);
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject, { propA: x => x > 20 });
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject2]);
    });

    test('if filter object is multi-level, gets objects which match filter object at the deeper level', () => {
      // Given
      class TestObject extends ReduxObject {
        constructor(propA) {
          super();
          this.propA = propA;
        }
      }

      const testObject1 = new TestObject({ propB: 10, propC: 5 });
      const testObject2 = new TestObject({ propB: 40, propC: 8 });
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject, {
        propA: { propB: 10, propC: x => x <= 5 },
      });
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject1]);
    });

    test('if filter object contains nulls, correctly handles object mapping', () => {
      // Given
      class TestObject extends ReduxObject {
        constructor(propA) {
          super();
          this.propA = propA;
        }
      }

      const testObject1 = new TestObject({ propB: 10, propC: 5 });
      const testObject2 = new TestObject({ propB: null, propC: 8 });
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject, {
        propA: { propB: null, propC: x => x > 5 },
      });
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject2]);
    });

    test('if filter object function throws error for item, excludes item without propagating error', () => {
      // Given
      class TestObject extends ReduxObject {
        constructor(propA) {
          super();
          this.propA = propA;
        }
      }

      const testObject1 = new TestObject({ propB: 'a cool string', propC: 5 });
      const testObject2 = new TestObject({ propB: null, propC: 8 });
      const state = {
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      };

      // When
      const selector = AccessDriver.find(TestObject, {
        propA: { propB: x => x.includes('cool'), propC: x => x <= 5 },
      });
      const result = selector(state);

      // Then
      expect(result).toEqual([testObject1]);
    });
  });
});
