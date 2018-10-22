import reducer from '../src/reducer';
import ReduxObject from '../src/ReduxObject';
import {
  DRIVER_INSERT_ONE,
  DRIVER_INSERT_MANY,
  DRIVER_DELETE_ONE,
} from '../src/actionTypes';

test('given undefined state and unhandled action type reducer returns empty object', () => {
  // Given
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(undefined, action);

  // Then
  expect(result).toEqual({});
});

test('given defined state and unhandled action type reducer returns state object', () => {
  // Given
  const state = {};
  const action = {
    type: 'SOME_UNHANDLED_TYPE',
  };

  // When
  const result = reducer(state, action);

  // Then
  expect(result).toBe(state);
});

describe('DRIVER_INSERT_ONE action', () => {
  describe('given undefined state', () => {
    test('if given payload is not an instance of ReduxObject, returns empty state object', () => {
      // Given
      const action = {
        type: DRIVER_INSERT_ONE,
        payload: { someProp: 'somePropValue' },
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({});
    });

    test('if given payload is an instance of ReduxObject, creates stateSlice and inserts object', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject = new TestObject();
      const action = {
        type: DRIVER_INSERT_ONE,
        payload: testObject,
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({
        [TestObject.stateSlice]: {
          [testObject.id]: testObject,
        },
      });
    });
  });

  describe('given defined state', () => {
    test('if given payload is not an instance of ReduxObject, returns given state object', () => {
      // Given
      const state = {};

      const action = {
        type: DRIVER_INSERT_ONE,
        payload: { someProp: 'somePropValue' },
      };

      // When
      const updatedState = reducer(state, action);

      // Then
      expect(updatedState).toBe(state);
    });

    describe('if given payload is an instance of ReduxObject', () => {
      test('returns new state object', () => {
        // Given
        const existingState = {};

        class TestObject extends ReduxObject {}

        const testObject = new TestObject();
        const action = {
          type: DRIVER_INSERT_ONE,
          payload: testObject,
        };

        // When
        const updatedState = reducer(existingState, action);

        // Then
        expect(updatedState).not.toBe(existingState);
      });

      describe('and state slice is missing', () => {
        test('creates state slice and inserts object', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject = new TestObject();
          const action = {
            type: DRIVER_INSERT_ONE,
            payload: testObject,
          };

          // When
          const updatedState = reducer({}, action);

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              [testObject.id]: testObject,
            },
          });
        });
      });

      describe('and state slice exists', () => {
        test('returns state object with new state slice object', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingStateSlice = {};
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const testObject = new TestObject();
          const action = {
            type: DRIVER_INSERT_ONE,
            payload: testObject,
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState[TestObject.stateSlice]).not.toBe(
            existingStateSlice,
          );
        });

        test('and object with id does not exist, adds object to state slice', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingTestObject1 = new TestObject();
          const existingTestObject2 = new TestObject();
          const existingStateSlice = {
            [existingTestObject1.id]: existingTestObject1,
            [existingTestObject2.id]: existingTestObject2,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const testObject = new TestObject();
          const action = {
            type: DRIVER_INSERT_ONE,
            payload: testObject,
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              ...existingStateSlice,
              [testObject.id]: testObject,
            },
          });
        });

        test('and object with id does exist, returns state without changes', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingTestObject = new TestObject();
          const existingStateSlice = {
            [existingTestObject.id]: existingTestObject,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const action = {
            type: DRIVER_INSERT_ONE,
            payload: existingTestObject,
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState).toBe(existingState);
        });
      });
    });
  });
});

describe('DRIVER_INSERT_MANY action', () => {
  describe('given undefined state', () => {
    test('if given payload is not an array, returns empty state object', () => {
      // Given
      const action = {
        type: DRIVER_INSERT_MANY,
        payload: { someProp: 'somePropValue' },
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({});
    });

    test('if given payload is an array of ReduxObject objects, creates stateSlice and inserts objects', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const action = {
        type: DRIVER_INSERT_MANY,
        payload: [testObject1, testObject2],
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      });
    });

    test('if given payload is an array of mixed objects, creates stateSlice and inserts only ReduxObject objects', () => {
      // Given
      class TestObject extends ReduxObject {}

      const testObject1 = new TestObject();
      const testObject2 = new TestObject();
      const action = {
        type: DRIVER_INSERT_MANY,
        payload: [testObject1, {}, testObject2],
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({
        [TestObject.stateSlice]: {
          [testObject1.id]: testObject1,
          [testObject2.id]: testObject2,
        },
      });
    });

    test('if given payload is an array of mixed ReduxObject objects, creates stateSlices and inserts objects into them', () => {
      // Given
      class TestObjectA extends ReduxObject {}
      class TestObjectB extends ReduxObject {}

      const testObject1 = new TestObjectA();
      const testObject2 = new TestObjectB();
      const action = {
        type: DRIVER_INSERT_MANY,
        payload: [testObject1, testObject2],
      };

      // When
      const updatedState = reducer(undefined, action);

      // Then
      expect(updatedState).toEqual({
        [TestObjectA.stateSlice]: {
          [testObject1.id]: testObject1,
        },
        [TestObjectB.stateSlice]: {
          [testObject2.id]: testObject2,
        },
      });
    });
  });

  describe('given defined state', () => {
    test('if given payload is not an array, returns given state object', () => {
      // Given
      const state = {};

      const action = {
        type: DRIVER_INSERT_MANY,
        payload: { someProp: 'somePropValue' },
      };

      // When
      const updatedState = reducer(state, action);

      // Then
      expect(updatedState).toBe(state);
    });

    describe('if given payload is an array', () => {
      test('which does not contain ReduxObject objects, returns given state object', () => {
        // Given
        const existingState = {};

        const action = {
          type: DRIVER_INSERT_MANY,
          payload: [{}, {}],
        };

        // When
        const updatedState = reducer(existingState, action);

        // Then
        expect(updatedState).toBe(existingState);
      });

      test('which contains ReduxObject objects, returns new state object', () => {
        // Given
        const existingState = {};

        class TestObject extends ReduxObject {}

        const testObject1 = new TestObject();
        const testObject2 = new TestObject();
        const action = {
          type: DRIVER_INSERT_MANY,
          payload: [testObject1, testObject2],
        };

        // When
        const updatedState = reducer(existingState, action);

        // Then
        expect(updatedState).not.toBe(existingState);
      });

      describe('and state slice is missing', () => {
        test('creates state slice and inserts objects', () => {
          // Given
          class TestObject extends ReduxObject {}

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const action = {
            type: DRIVER_INSERT_MANY,
            payload: [testObject1, testObject2],
          };

          // When
          const updatedState = reducer({}, action);

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          });
        });
      });

      describe('and state slice exists', () => {
        test('returns state object with new state slice object', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingStateSlice = {};
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const action = {
            type: DRIVER_INSERT_MANY,
            payload: [testObject1, testObject2],
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState[TestObject.stateSlice]).not.toBe(
            existingStateSlice,
          );
        });

        test('and objects with ids do not exist, adds objects to state slice', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingTestObject1 = new TestObject();
          const existingTestObject2 = new TestObject();
          const existingStateSlice = {
            [existingTestObject1.id]: existingTestObject1,
            [existingTestObject2.id]: existingTestObject2,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const testObject1 = new TestObject();
          const testObject2 = new TestObject();
          const action = {
            type: DRIVER_INSERT_MANY,
            payload: [testObject1, testObject2],
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              ...existingStateSlice,
              [testObject1.id]: testObject1,
              [testObject2.id]: testObject2,
            },
          });
        });

        test('and some objects with ids already exist, only adds objects with new ids to state', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingTestObject = new TestObject();
          const existingStateSlice = {
            [existingTestObject.id]: existingTestObject,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const newTestObject = new TestObject();
          const action = {
            type: DRIVER_INSERT_MANY,
            payload: [existingTestObject, newTestObject],
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(updatedState).toEqual({
            [TestObject.stateSlice]: {
              ...existingStateSlice,
              [newTestObject.id]: newTestObject,
            },
          });
        });

        test('and some objects with ids already exist, does not overwrite existing objects', () => {
          // Given
          class TestObject extends ReduxObject {}

          const existingTestObject = new TestObject();
          const existingStateSlice = {
            [existingTestObject.id]: existingTestObject,
          };
          const existingState = {
            [TestObject.stateSlice]: existingStateSlice,
          };

          const newTestObject = new TestObject();

          const newObjectWithExistingId = new TestObject();
          newObjectWithExistingId.id = existingTestObject.id;

          const action = {
            type: DRIVER_INSERT_MANY,
            payload: [newObjectWithExistingId, newTestObject],
          };

          // When
          const updatedState = reducer(existingState, action);

          // Then
          expect(
            updatedState[TestObject.stateSlice][existingTestObject.id],
          ).toBe(existingTestObject);
        });
      });
    });
  });
});

describe('DRIVER_DELETE_ONE action', () => {
  describe('given undefined state', () => {
    test('if payload objectType is undefined, returns empty state object', () => {
      // Given
      const action = {
        type: DRIVER_DELETE_ONE,
        payload: {},
      };

      // When
      const result = reducer(undefined, action);

      // Then
      expect(result).toEqual({});
    });

    test('if payload objectType does not extend ReduxObject, returns empty state object', () => {
      // Given
      const action = {
        type: DRIVER_DELETE_ONE,
        payload: { objectType: {} },
      };

      // When
      const result = reducer(undefined, action);

      // Then
      expect(result).toEqual({});
    });

    describe('if payload objectType does extend ReduxObject', () => {
      test('and filter is undefined, returns empty state object', () => {
        // Given
        class TestObject extends ReduxObject {}

        const action = {
          type: DRIVER_DELETE_ONE,
          payload: { objectType: TestObject },
        };

        // When
        const result = reducer(undefined, action);

        // Then
        expect(result).toEqual({});
      });

      test('and filter is null, returns empty state object', () => {
        // Given
        class TestObject extends ReduxObject {}

        const action = {
          type: DRIVER_DELETE_ONE,
          payload: { objectType: TestObject, filter: null },
        };

        // When
        const result = reducer(undefined, action);

        // Then
        expect(result).toEqual({});
      });
    });
  });

  describe('given defined state', () => {
    test('if payload objectType is undefined, returns unchanged state object', () => {
      // Given
      const state = {};
      const action = {
        type: DRIVER_DELETE_ONE,
        payload: {},
      };

      // When
      const updatedState = reducer(state, action);

      // Then
      expect(updatedState).toBe(state);
    });

    test('if payload objectType does not extend ReduxObject, returns unchanged state object', () => {
      // Given
      const state = {};
      const action = {
        type: DRIVER_DELETE_ONE,
        payload: { objectType: {} },
      };

      // When
      const updatedState = reducer(state, action);

      // Then
      expect(updatedState).toBe(state);
    });

    describe('if payload objectType does extend ReduxObject', () => {
      test('and state slice is not populated, returns given state', () => {
        // Given
        class TestObject extends ReduxObject {}

        const state = { someState: 'someStateValue' };
        const action = {
          type: DRIVER_DELETE_ONE,
          payload: { objectType: TestObject },
        };

        // When
        const updatedState = reducer(state, action);

        // Then
        expect(updatedState).toBe(state);
      });

      describe('and state slice is populated', () => {
        test('but empty, returns given state', () => {
          // Given
          class TestObject extends ReduxObject {}

          const state = { [TestObject.stateSlice]: {} };
          const action = {
            type: DRIVER_DELETE_ONE,
            payload: { objectType: TestObject },
          };

          // When
          const updatedState = reducer(state, action);

          // Then
          expect(updatedState).toBe(state);
        });

        describe('with existing objects', () => {
          test('and filter is undefined, deletes first object from state', () => {
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

            const action = {
              type: DRIVER_DELETE_ONE,
              payload: { objectType: TestObject },
            };

            // When
            const updatedState = reducer(state, action);

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
            const state = {
              [TestObject.stateSlice]: {
                [testObject1.id]: testObject1,
                [testObject2.id]: testObject2,
              },
            };

            const action = {
              type: DRIVER_DELETE_ONE,
              payload: { objectType: TestObject, filter: null },
            };

            // When
            const updatedState = reducer(state, action);

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
              class TestObject extends ReduxObject {
                constructor(propA) {
                  super();
                  this.propA = propA;
                }
              }

              const propAValue = 21;
              const testObject1 = new TestObject(35);
              const testObject2 = new TestObject(propAValue);
              const testObject3 = new TestObject(propAValue);
              const state = {
                [TestObject.stateSlice]: {
                  [testObject1.id]: testObject1,
                  [testObject2.id]: testObject2,
                  [testObject3.id]: testObject3,
                },
              };

              const action = {
                type: DRIVER_DELETE_ONE,
                payload: {
                  objectType: TestObject,
                  filter: { propA: propAValue },
                },
              };

              // When
              const updatedState = reducer(state, action);

              // Then
              expect(updatedState).toEqual({
                [TestObject.stateSlice]: {
                  [testObject1.id]: testObject1,
                  [testObject3.id]: testObject3,
                },
              });
            });

            test('but no matching object, returns given state', () => {
              // Given
              class TestObject extends ReduxObject {
                constructor(propA) {
                  super();
                  this.propA = propA;
                }
              }

              const testObject1 = new TestObject(35);
              const testObject2 = new TestObject(25);
              const state = {
                [TestObject.stateSlice]: {
                  [testObject1.id]: testObject1,
                  [testObject2.id]: testObject2,
                },
              };

              const action = {
                type: DRIVER_DELETE_ONE,
                payload: {
                  objectType: TestObject,
                  filter: { propA: 15 },
                },
              };

              // When
              const updatedState = reducer(state, action);

              // Then
              expect(updatedState).toBe(state);
            });
          });
        });
      });
    });
  });
});
