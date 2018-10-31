import sinon from 'sinon';
import AccessDriver from '../src/AccessDriver';
import ReduxObject from '../src/ReduxObject';
import * as CreateFilterFunctionTreeModule from '../src/functionTreeCreation/createFilterFunctionTree';

let errorStub;
let createFilterFunctionTreeStub;

beforeAll(() => {
  errorStub = sinon.stub(console, 'error');
  createFilterFunctionTreeStub = sinon.stub(
    CreateFilterFunctionTreeModule,
    'default',
  );
});

afterEach(() => {
  errorStub.reset();
  createFilterFunctionTreeStub.reset();
});

describe('find', () => {
  test('if object type does not extend ReduxObject, publishes warning', () => {
    // When
    AccessDriver.find({});

    // Then
    expect(errorStub.calledOnce).toBe(true);
    expect(errorStub.getCall(0).args[0]).toBe(
      'Warning: To create a working selector objectType must extend ReduxObject.',
    );
  });

  test('if object type does not extend ReduxObject, returns selector which returns empty array', () => {
    // When
    const selector = AccessDriver.find({});
    const result = selector({});

    // Then
    expect(result).toEqual([]);
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

    test('if no filter object specified gets all objects of type', () => {
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

    describe('if filter object specified', () => {
      test('returns all objects that pass all tests in created filter function list', () => {
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

        const filter = {};

        const functionTree = x => x === testObject2;
        createFilterFunctionTreeStub
          .withArgs(sinon.match.same(filter))
          .returns(functionTree);

        // When
        const selector = AccessDriver.find(TestObject, filter);
        const result = selector(state);

        // Then
        expect(result).toEqual([testObject2]);
      });

      test('returns only objects that do no throw errors when running created filter function list', () => {
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

        const filter = {};

        const functionTree = (x) => {
          if (x === testObject2) {
            throw new Error();
          }
          return true;
        };

        createFilterFunctionTreeStub
          .withArgs(sinon.match.same(filter))
          .returns(functionTree);

        // When
        const selector = AccessDriver.find(TestObject, filter);
        const result = selector(state);

        // Then
        expect(result).toEqual([testObject1]);
      });
    });
  });
});
