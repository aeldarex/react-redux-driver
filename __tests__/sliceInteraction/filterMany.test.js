import sinon from 'sinon';
import * as CreateFilterFunctionTree from '../../src/functionTreeCreation/createFilterFunctionTree';
import filterMany from '../../src/sliceInteraction/filterMany';

let createFilterFunctionTreeStub;

beforeAll(() => {
  createFilterFunctionTreeStub = sinon.stub(
    CreateFilterFunctionTree,
    'default',
  );
});

afterEach(() => {
  createFilterFunctionTreeStub.reset();
});

test('returns array of all objects which pass function tree', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 10 };
  const obj3 = { propA: 5 };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  const functionTree = sinon.fake(x => x.propA === 5);

  const filter = { propA: 5 };
  createFilterFunctionTreeStub.withArgs(filter).returns(functionTree);

  // When
  const result = filterMany(table, filter);

  // Then
  expect(result).toEqual([obj1, obj3]);
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: 5 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: 5 };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  const functionTree = sinon.fake((x) => {
    if (x === obj3) {
      throw new Error();
    }

    return x.propA === 5;
  });

  const filter = { propA: 5 };
  createFilterFunctionTreeStub.withArgs(filter).returns(functionTree);

  // When
  const result = filterMany(table, filter);

  // Then
  expect(result).toEqual([obj1, obj2]);
});
