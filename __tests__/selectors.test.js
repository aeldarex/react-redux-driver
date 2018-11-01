import sinon from 'sinon';
import * as CreateFindManySelectorModule from '../src/selectorCreation/createFindManySelector';
import ReduxObject from '../src/ReduxObject';
import { find } from '../src/selectors';

let createFindManySelectorStub;

beforeAll(() => {
  createFindManySelectorStub = sinon.stub(
    CreateFindManySelectorModule,
    'default',
  );
});

afterEach(() => {
  createFindManySelectorStub.reset();
});

afterAll(() => {
  createFindManySelectorStub.restore();
});

test('find creates find many selector with given object type and filter', () => {
  // Given
  class TestObject extends ReduxObject {}
  const filter = { propA: 5 };

  const findManySelector = {};
  createFindManySelectorStub
    .withArgs(TestObject, filter)
    .returns(findManySelector);

  // When
  const selector = find(TestObject, filter);

  // Then
  expect(selector).toBe(findManySelector);
});
