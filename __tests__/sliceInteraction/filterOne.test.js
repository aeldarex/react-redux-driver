import sinon from 'sinon';
import * as CreateFilterFunctionTree from '../../src/functionTreeCreation/createFilterFunctionTree';
import filterOne from '../../src/sliceInteraction/filterOne';

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

test('returns first object which passes function tree', () => {
  // Given
  const obj1 = { propA: 10 };
  const obj2 = { propA: 5 };
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
  const result = filterOne(table, filter);

  // Then
  expect(result).toEqual(obj2);
});

test('considers items which throw errors as failing filter', () => {
  // Given
  const obj1 = { propA: 10 };
  const obj2 = { propA: 5 };
  const obj3 = { propA: 5 };
  const table = {
    0: obj1,
    1: obj2,
    2: obj3,
  };

  const functionTree = sinon.fake((x) => {
    if (x === obj2) {
      throw new Error();
    }

    return x.propA === 5;
  });

  const filter = { propA: 5 };
  createFilterFunctionTreeStub.withArgs(filter).returns(functionTree);

  // When
  const result = filterOne(table, filter);

  // Then
  expect(result).toEqual(obj3);
});
