import sinon from 'sinon';
import deleteManyHandler from '../../src/reducerActionHandlers/deleteManyHandler';
import ReduxObject from '../../src/ReduxObject';
import * as filterUtils from '../../src/utils/functionTreeCreation/createFilterFunctionTree';

let errorStub;
let createFilterFunctionTreeStub;

beforeAll(() => {
  errorStub = sinon.stub(console, 'error');
  createFilterFunctionTreeStub = sinon.stub(filterUtils, 'default');
});

afterEach(() => {
  errorStub.reset();
  createFilterFunctionTreeStub.reset();
});

test('if state is undefined, produces warning', () => {
  // When
  deleteManyHandler();

  // Then
  expect(
    errorStub.calledWith(
      'Warning: A DRIVER_DELETE_MANY action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is undefined, returns empty object', () => {
  // When
  const updatedState = deleteManyHandler();

  // Then
  expect(updatedState).toEqual({});
});

test('if state is null, produces warning', () => {
  // When
  deleteManyHandler(null);

  // Then
  expect(
    errorStub.calledWith(
      'Warning: A DRIVER_DELETE_MANY action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is null, returns empty object', () => {
  // When
  const updatedState = deleteManyHandler(null);

  // Then
  expect(updatedState).toEqual({});
});

test('if payload objectType is undefined, produces warning', () => {
  // When
  deleteManyHandler({}, {});

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_DELETE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
  // When
  deleteManyHandler({}, { objectType: {} });

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_DELETE_MANY action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

describe('given defined state', () => {
  test('if payload objectType is undefined, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = deleteManyHandler(existingState, {});

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('if payload objectType does not extend ReduxObject, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = deleteManyHandler(existingState, { objectType: {} });

    // Then
    expect(updatedState).toBe(existingState);
  });

  describe('if payload objectType does extend ReduxObject', () => {
    test('and state slice is not populated, returns given state', () => {
      // Given
      class TestObject extends ReduxObject {}

      const existingState = {};

      // When
      const updatedState = deleteManyHandler(existingState, {
        objectType: TestObject,
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    describe('and state slice is populated', () => {
      test('but empty, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = { [TestObject.stateSlice]: {} };

        // When
        const updatedState = deleteManyHandler(existingState, {
          objectType: TestObject,
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      describe('with existing objects', () => {
        test('and filter is undefined, returns new state object', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const existingState = {
            [TestObject.stateSlice]: {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          };

          // When
          const updatedState = deleteManyHandler(existingState, {
            objectType: TestObject,
          });

          // Then
          expect(updatedState).not.toBe(existingState);
        });

        test('and filter is undefined, returns new state slice object', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const existingStateSlice = {
            [testObject1.id]: testObject1,
            [testObject2.id]: testObject2,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          // When
          const updatedState = deleteManyHandler(existingState, {
            objectType: TestObject,
          });

          // Then
          expect(updatedState[TestObject.stateSlice]).not.toBe(
            existingStateSlice,
          );
        });

        test('and filter is undefined, deletes all objects from state', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const existingState = {
            [TestObject.stateSlice]: {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          };

          // When
          const updatedState = deleteManyHandler(existingState, {
            objectType: TestObject,
          });

          // Then
          expect(updatedState).toEqual({ [TestObject.stateSlice]: {} });
        });

        test('and filter is null, deletes all objects from state', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const existingState = {
            [TestObject.stateSlice]: {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          };

          // When
          const updatedState = deleteManyHandler(existingState, {
            objectType: TestObject,
            filter: null,
          });

          // Then
          expect(updatedState).toEqual({ [TestObject.stateSlice]: {} });
        });

        describe('and filter is defined', () => {
          test('and matching objects exists, deletes all object matching filter', () => {
            // Given
            class TestObject extends ReduxObject {}

            const testObject1 = new TestObject();
            const testObject2 = new TestObject();
            const testObject3 = new TestObject();
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
                [testObject3.id]: testObject3,
              },
            };

            const filter = {};

            const functionTree = x => x === testObject2 || x === testObject3;
            createFilterFunctionTreeStub
              .withArgs(sinon.match.same(filter))
              .returns(functionTree);

            // When
            const updatedState = deleteManyHandler(existingState, {
              objectType: TestObject,
              filter,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
              },
            });
          });

          test('but no matching object, returns given state', () => {
            // Given
            class TestObject extends ReduxObject {}

            const testObject1 = new TestObject();
            const testObject2 = new TestObject();
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const filter = {};

            const functionTree = () => false;
            createFilterFunctionTreeStub
              .withArgs(sinon.match.same(filter))
              .returns(functionTree);

            // When
            const updatedState = deleteManyHandler(existingState, {
              objectType: TestObject,
              filter,
            });

            // Then
            expect(updatedState).toBe(existingState);
          });
        });
      });
    });
  });
});
