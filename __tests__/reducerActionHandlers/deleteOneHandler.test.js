import sinon from 'sinon';
import deleteOneHandler from '../../src/reducerActionHandlers/deleteOneHandler';
import ReduxObject from '../../src/ReduxObject';
import * as filterUtils from '../../src/utils/createFilterFunctionList';

let warningStub;
let createFilterFunctionListStub;

beforeEach(() => {
  warningStub = sinon.stub(console, 'error');

  createFilterFunctionListStub = sinon.stub(filterUtils, 'default');
  createFilterFunctionListStub.returns([]);
});

afterEach(() => {
  warningStub.restore();
  createFilterFunctionListStub.restore();
});

test('if state is undefined, produces warning', () => {
  // When
  deleteOneHandler();

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_DELETE_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is undefined, returns empty object', () => {
  // When
  const updatedState = deleteOneHandler();

  // Then
  expect(updatedState).toEqual({});
});

test('if state is null, produces warning', () => {
  // When
  deleteOneHandler(null);

  // Then
  expect(
    warningStub.calledWith(
      'Warning: A DRIVER_DELETE_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is null, returns empty object', () => {
  // When
  const updatedState = deleteOneHandler(null);

  // Then
  expect(updatedState).toEqual({});
});

test('if payload objectType is undefined, produces warning', () => {
  // When
  deleteOneHandler({}, {});

  // Then
  expect(
    warningStub.calledWith(
      "Warning: A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
  // When
  deleteOneHandler({}, { objectType: {} });

  // Then
  expect(
    warningStub.calledWith(
      "Warning: A DRIVER_DELETE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

describe('given defined state', () => {
  test('if payload objectType is undefined, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = deleteOneHandler(existingState, {});

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('if payload objectType does not extend ReduxObject, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = deleteOneHandler(existingState, { objectType: {} });

    // Then
    expect(updatedState).toBe(existingState);
  });

  describe('if payload objectType does extend ReduxObject', () => {
    test('and state slice is not populated, returns given state', () => {
      // Given
      class TestObject extends ReduxObject {}

      const existingState = {};

      // When
      const updatedState = deleteOneHandler(existingState, {
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
        const updatedState = deleteOneHandler(existingState, {
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
          const updatedState = deleteOneHandler(existingState, {
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
          const updatedState = deleteOneHandler(existingState, {
            objectType: TestObject,
          });

          // Then
          expect(updatedState[TestObject.stateSlice]).not.toBe(
            existingStateSlice,
          );
        });

        test('and filter is undefined, deletes first object from state', () => {
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
          const updatedState = deleteOneHandler(existingState, {
            objectType: TestObject,
          });

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              [testObject2.id]: testObject2,
            },
          });
        });

        test('and filter is null, deletes first object from state', () => {
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
          const updatedState = deleteOneHandler(existingState, {
            objectType: TestObject,
            filter: null,
          });

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              [testObject2.id]: testObject2,
            },
          });
        });

        describe('and filter is defined', () => {
          test('and matching objects exists, deletes first object matching filter', () => {
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

            const func1 = () => true;
            const func2 = x => x === testObject2 || x === testObject3;
            createFilterFunctionListStub
              .withArgs(sinon.match.same(filter))
              .returns([func1, func2]);

            // When
            const updatedState = deleteOneHandler(existingState, {
              objectType: TestObject,
              filter,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject3.id]: testObject3,
              },
            });
          });

          test('and object throws error while running filter functions,item is considered as not matching filter', () => {
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

            const func1 = () => true;
            const func2 = (x) => {
              if (x === testObject2) {
                throw new Error();
              }

              return x === testObject3;
            };
            createFilterFunctionListStub
              .withArgs(sinon.match.same(filter))
              .returns([func1, func2]);

            // When
            const updatedState = deleteOneHandler(existingState, {
              objectType: TestObject,
              filter,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
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

            const func1 = () => true;
            const func2 = () => false;
            createFilterFunctionListStub
              .withArgs(sinon.match.same(filter))
              .returns([func1, func2]);

            // When
            const updatedState = deleteOneHandler(existingState, {
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
