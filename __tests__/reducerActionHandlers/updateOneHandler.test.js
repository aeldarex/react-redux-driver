/* eslint no-param-reassign: 0 */

import sinon from 'sinon';
import updateOneHandler from '../../src/reducerActionHandlers/updateOneHandler';
import ReduxObject from '../../src/ReduxObject';
import * as FilterOneModule from '../../src/sliceInteraction/filterOne';
import * as UpdateOneModule from '../../src/sliceInteraction/updateOne';

let errorStub;
let filterOneStub;
let updateOneStub;

beforeAll(() => {
  errorStub = sinon.stub(console, 'error');

  filterOneStub = sinon.stub(FilterOneModule, 'default');
  updateOneStub = sinon.stub(UpdateOneModule, 'default');
});

afterEach(() => {
  errorStub.reset();
  filterOneStub.reset();
  updateOneStub.reset();
});

test('if state is undefined, produces warning', () => {
  // When
  updateOneHandler();

  // Then
  expect(
    errorStub.calledWith(
      'Warning: A DRIVER_UPDATE_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is undefined, returns empty object', () => {
  // When
  const updatedState = updateOneHandler();

  // Then
  expect(updatedState).toEqual({});
});

test('if state is null, produces warning', () => {
  // When
  updateOneHandler(null);

  // Then
  expect(
    errorStub.calledWith(
      'Warning: A DRIVER_UPDATE_ONE action was ignored because the given state was null or undefined.',
    ),
  ).toBe(true);
});

test('if state is null, returns empty object', () => {
  // When
  const updatedState = updateOneHandler(null);

  // Then
  expect(updatedState).toEqual({});
});

test('if payload objectType is undefined, produces warning', () => {
  // When
  updateOneHandler({}, {});

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
  // When
  updateOneHandler({}, { objectType: {} });

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload update is undefined, produces warning', () => {
  // When
  updateOneHandler({}, {});

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    ),
  ).toBe(true);
});

test('if payload update is null, produces warning', () => {
  // When
  updateOneHandler({}, { update: null });

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    ),
  ).toBe(true);
});

test('if payload update is empty, produces warning', () => {
  // When
  updateOneHandler({}, { update: {} });

  // Then
  expect(
    errorStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    ),
  ).toBe(true);
});

describe('given defined state', () => {
  test('if payload objectType is undefined, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = updateOneHandler(existingState, {});

    // Then
    expect(updatedState).toBe(existingState);
  });

  test('if payload objectType does not extend ReduxObject, returns unchanged state object', () => {
    // Given
    const existingState = {};

    // When
    const updatedState = updateOneHandler(existingState, { objectType: {} });

    // Then
    expect(updatedState).toBe(existingState);
  });

  describe('given objectType which does extend ReduxObject', () => {
    test('if payload update is undefined, returns unchanged state object', () => {
      // Given
      class TestObject extends ReduxObject {}

      const existingState = {};

      // When
      const updatedState = updateOneHandler(existingState, {
        objectType: TestObject,
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload update is null, returns unchanged state object', () => {
      // Given
      class TestObject extends ReduxObject {}

      const existingState = {};

      // When
      const updatedState = updateOneHandler(existingState, {
        objectType: TestObject,
        update: null,
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    test('if payload update is empty object, returns unchanged state object', () => {
      // Given
      class TestObject extends ReduxObject {}

      const existingState = {};

      // When
      const updatedState = updateOneHandler(existingState, {
        objectType: TestObject,
        update: {},
      });

      // Then
      expect(updatedState).toBe(existingState);
    });

    describe('given populated update object', () => {
      test('and state slice is not populated, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = {};

        // When
        const updatedState = updateOneHandler(existingState, {
          objectType: TestObject,
          update: { propA: 5 },
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('and state slice is populated but empty, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const existingState = { [TestObject.stateSlice]: {} };

        // When
        const updatedState = updateOneHandler(existingState, {
          objectType: TestObject,
          update: { propA: 5 },
        });

        // Then
        expect(updatedState).toBe(existingState);
      });

      describe('and state slice is populated with items', () => {
        test('returns new state object', () => {
          // Given
          class TestObject extends ReduxObject {
            constructor(propA) {
              super();
              this.propA = propA;
            }
          }

          const testObject1 = new TestObject(1);
          const testObject2 = new TestObject(2);
          const existingState = {
            [TestObject.stateSlice]: {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          };

          const update = { propA: 5, propB: x => x * 2 };
          const newItem = new TestObject(5, 20);
          newItem.id = testObject1.id;
          updateOneStub.withArgs(testObject1, update).returns(newItem);

          // When
          const updatedState = updateOneHandler(existingState, {
            objectType: TestObject,
            update,
          });

          // Then
          expect(updatedState).not.toBe(existingState);
        });

        test('returns new state slice object', () => {
          // Given
          class TestObject extends ReduxObject {
            constructor(propA) {
              super();
              this.propA = propA;
            }
          }

          const testObject1 = new TestObject(1);
          const testObject2 = new TestObject(2);
          const existingStateSlice = {
            [testObject1.id]: testObject1,
            [testObject2.id]: testObject2,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const update = { propA: 5, propB: x => x * 2 };
          const newItem = new TestObject(5, 20);
          newItem.id = testObject1.id;
          updateOneStub.withArgs(testObject1, update).returns(newItem);

          // When
          const updatedState = updateOneHandler(existingState, {
            objectType: TestObject,
            update,
          });

          // Then
          expect(updatedState[TestObject.stateSlice]).not.toBe(
            existingStateSlice,
          );
        });

        describe('and filter is undefined', () => {
          test('updates first item from state', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const update = { propA: 5, propB: x => x * 2 };
            const newItem = new TestObject(5, 20);
            newItem.id = testObject1.id;
            updateOneStub.withArgs(testObject1, update).returns(newItem);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              update,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: newItem,
                [testObject2.id]: testObject2,
              },
            });
          });

          test('updated item is a new object', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const update = { propA: 5, propB: x => x * 2 };
            const newItem = new TestObject(5, 20);
            newItem.id = testObject1.id;
            updateOneStub.withArgs(testObject1, update).returns(newItem);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              update,
            });

            // Then
            expect(
              updatedState[TestObject.stateSlice][testObject1.id],
            ).not.toBe(testObject1);
          });
        });

        describe('and filter is defined', () => {
          test('and matching item is found, updates matching item', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingStateSlice = {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            };
            const existingState = {
              [TestObject.stateSlice]: existingStateSlice,
            };

            const filter = { propA: 2, propB: 20 };
            filterOneStub
              .withArgs(existingStateSlice, filter)
              .returns(testObject2);

            const update = { propA: 6, propB: x => x * 3 };
            const newItem = new TestObject(6, 60);
            newItem.id = testObject2.id;
            updateOneStub.withArgs(testObject2, update).returns(newItem);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: newItem,
              },
            });
          });

          test('and matching item is found, updated item is a new object', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingStateSlice = {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            };
            const existingState = {
              [TestObject.stateSlice]: existingStateSlice,
            };

            const filter = { propA: 2, propB: 20 };
            filterOneStub
              .withArgs(existingStateSlice, filter)
              .returns(testObject2);

            const update = { propA: 6, propB: x => x * 3 };
            const newItem = new TestObject(6, 60);
            newItem.id = testObject2.id;
            updateOneStub.withArgs(testObject2, update).returns(newItem);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(
              updatedState[TestObject.stateSlice][testObject2.id],
            ).not.toBe(testObject2);
          });

          test('and updateOne returns null, given state is returned', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingStateSlice = {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            };
            const existingState = {
              [TestObject.stateSlice]: existingStateSlice,
            };

            const filter = { propA: 2, propB: 20 };
            filterOneStub
              .withArgs(existingStateSlice, filter)
              .returns(testObject2);

            const update = { propA: 6, propB: x => x * 3 };
            updateOneStub.withArgs(testObject2, update).returns(null);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(updatedState).toBe(existingState);
          });

          test('but no matching object, returns given state', () => {
            // Given
            class TestObject extends ReduxObject {
              constructor(propA, propB) {
                super();
                this.propA = propA;
                this.propB = propB;
              }
            }

            const testObject1 = new TestObject(1, 10);
            const testObject2 = new TestObject(2, 20);
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const filter = { propA: 3, propB: 30 };
            const update = { propA: 7, propB: x => x * 4 };

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(updatedState).toBe(existingState);
          });
        });
      });
    });
  });
});
