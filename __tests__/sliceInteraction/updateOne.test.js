/* eslint no-param-reassign: 0 */

import sinon from 'sinon';
import * as CreateUpdateFunctionTreeModules from '../../src/functionTreeCreation/createUpdateFunctionTree';
import updateOne from '../../src/sliceInteraction/updateOne';

let errorStub;
let createUpdateFunctionTreeStub;

beforeAll(() => {
  errorStub = sinon.stub(console, 'error');
  createUpdateFunctionTreeStub = sinon.stub(
    CreateUpdateFunctionTreeModules,
    'default',
  );
});

afterEach(() => {
  errorStub.reset();
  createUpdateFunctionTreeStub.reset();
});

test('returns copy of given item with updates applied', () => {
  // Given
  class SomeObject {}

  const obj1 = new SomeObject();
  obj1.propA = 10;
  obj1.propB = { propC: 5 };

  const functionTree = sinon.fake((x) => {
    x.propA = 5;
  });

  const update = { propA: 5 };
  createUpdateFunctionTreeStub.withArgs(update).returns(functionTree);

  // When
  const result = updateOne(obj1, update);

  // Then
  expect(result).not.toBe(obj1);
  expect(result).toBeInstanceOf(SomeObject);
  expect(result).toEqual({ propA: 5, propB: { propC: 5 } });
});

test('if function tree fails update with error produces warning', () => {
  // Given
  const obj1 = { propA: 10 };

  const functionTree = sinon.fake(() => {
    throw new Error();
  });

  const update = { propA: 5 };
  createUpdateFunctionTreeStub.withArgs(update).returns(functionTree);

  // When
  updateOne(obj1, update);

  // Then
  expect(
    errorStub.calledWith(
      `Warning: Failed to update ${JSON.stringify(
        obj1,
      )} due to the following error: Error`,
    ),
  ).toBe(true);
});

test('if function tree fails update with error returns null', () => {
  // Given
  const obj1 = {};

  const functionTree = sinon.fake(() => {
    throw new Error();
  });

  const update = { propA: 5 };
  createUpdateFunctionTreeStub.withArgs(update).returns(functionTree);

  // When
  const result = updateOne(obj1, update);

  // Then
  expect(result).toBeNull();
});
