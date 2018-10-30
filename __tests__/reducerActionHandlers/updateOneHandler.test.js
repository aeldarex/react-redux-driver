/* eslint no-param-reassign: 0 */

import sinon from 'sinon';
import updateOneHandler from '../../src/reducerActionHandlers/updateOneHandler';
import ReduxObject from '../../src/ReduxObject';
import * as filterUtils from '../../src/utils/createFunctionTree';

let warningStub;
let createFunctionTreeStub;

beforeEach(() => {
  warningStub = sinon.stub(console, 'error');

  createFunctionTreeStub = sinon.stub(filterUtils, 'default');
  createFunctionTreeStub.returns([]);
});

afterEach(() => {
  warningStub.restore();
  createFunctionTreeStub.restore();
});

test('if state is undefined, produces warning', () => {
  // When
  updateOneHandler();

  // Then
  expect(
    warningStub.calledWith(
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
    warningStub.calledWith(
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
    warningStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload objectType is object which does not extend ReduxObject, produces warning', () => {
  // When
  updateOneHandler({}, { objectType: {} });

  // Then
  expect(
    warningStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's objectType does not extend ReduxObject.",
    ),
  ).toBe(true);
});

test('if payload update is undefined, produces warning', () => {
  // When
  updateOneHandler({}, {});

  // Then
  expect(
    warningStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    ),
  ).toBe(true);
});

test('if payload update is null, produces warning', () => {
  // When
  updateOneHandler({}, { update: null });

  // Then
  expect(
    warningStub.calledWith(
      "Warning: A DRIVER_UPDATE_ONE action was ignored because the payload's update was empty or missing.",
    ),
  ).toBe(true);
});

test('if payload update is empty, produces warning', () => {
  // When
  updateOneHandler({}, { update: {} });

  // Then
  expect(
    warningStub.calledWith(
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

          // When
          const updatedState = updateOneHandler(existingState, {
            objectType: TestObject,
            update: { propA: 5 },
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

          // When
          const updatedState = updateOneHandler(existingState, {
            objectType: TestObject,
            update: { propA: 5 },
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

            const func1 = (x) => {
              x.propA = 5;
            };
            const func2 = (x) => {
              x.propB *= 2;
            };
            createFunctionTreeStub.withArgs(update).returns([func1, func2]);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              update,
            });

            // Then
            expect(updatedState).toEqual({
              [TestObject.stateSlice]: {
                [testObject1.id]: { ...testObject1, propA: 5, propB: 20 },
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

            const func1 = (x) => {
              x.propA = 5;
            };
            const func2 = (x) => {
              x.propB *= 2;
            };
            createFunctionTreeStub.withArgs(update).returns([func1, func2]);

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
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = x => x.propA === 2;
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = (x) => {
              x.propB *= 3;
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

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
                [testObject2.id]: { ...testObject2, propA: 6, propB: 60 },
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
            const existingState = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = x => x.propA === 2;
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = (x) => {
              x.propB *= 3;
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

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

          test('and matching item is found, updated item is an instance of a ReduxObject', () => {
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

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = x => x.propA === 2;
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = (x) => {
              x.propB *= 3;
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(
              updatedState[TestObject.stateSlice][testObject2.id],
            ).toBeInstanceOf(ReduxObject);
          });

          test('and item throws error during filtration, item is ignored', () => {
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

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = (x) => {
              if (x === testObject1) {
                throw new Error();
              }
              return x.propA === 2;
            };
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = (x) => {
              x.propB *= 3;
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

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
                [testObject2.id]: { ...testObject2, propA: 6, propB: 60 },
              },
            });
          });

          test('and item throws error during updating, given state is returned', () => {
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

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = x => x.propA === 2;
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = () => {
              throw new Error();
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

            // When
            const updatedState = updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(updatedState).toBe(existingState);
          });

          test('and item throws error during updating, warning is published', () => {
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

            const filter = { propA: 2, propB: 20 };
            const filterFunc1 = x => x.propA === 2;
            const filterFunc2 = x => x.propB === 20;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 6, propB: x => x * 3 };
            const updateFunc1 = (x) => {
              x.propA = 6;
            };
            const updateFunc2 = () => {
              throw new Error('Invalid update call.');
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

            // When
            updateOneHandler(existingState, {
              objectType: TestObject,
              filter,
              update,
            });

            // Then
            expect(
              warningStub.calledWith(
                `Warning: Failed to update TestObject with id ${
                  testObject2.id
                } due to the following error: Error: Invalid update call.`,
              ),
            ).toBe(true);
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
            const filterFunc1 = x => x.propA === 3;
            const filterFunc2 = x => x.propB === 30;
            createFunctionTreeStub
              .withArgs(filter)
              .returns([filterFunc1, filterFunc2]);

            const update = { propA: 7, propB: x => x * 4 };
            const updateFunc1 = (x) => {
              x.propA = 7;
            };
            const updateFunc2 = (x) => {
              x.propB *= 4;
            };
            createFunctionTreeStub
              .withArgs(update)
              .returns([updateFunc1, updateFunc2]);

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
