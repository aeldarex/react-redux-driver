import sinon from 'sinon';
import * as CreateFindOneSelectorModule from '../src/selectorCreation/createFindOneSelector';
import * as CreateFindManySelectorModule from '../src/selectorCreation/createFindManySelector';
import * as CreateGetSectionSelectorModule from '../src/selectorCreation/createGetSectionSelector';
import ReduxObject from '../src/ReduxObject';
import { findOne, findMany, getSection } from '../src/selectors';

let createFindOneSelectorStub;
let createFindManySelectorStub;
let createGetSectionSelectorStub;

beforeAll(() => {
  createFindOneSelectorStub = sinon.stub(
    CreateFindOneSelectorModule,
    'default',
  );
  createFindManySelectorStub = sinon.stub(
    CreateFindManySelectorModule,
    'default',
  );
  createGetSectionSelectorStub = sinon.stub(
    CreateGetSectionSelectorModule,
    'default',
  );
});

afterEach(() => {
  createFindOneSelectorStub.reset();
  createFindManySelectorStub.reset();
  createGetSectionSelectorStub.reset();
});

afterAll(() => {
  createFindOneSelectorStub.restore();
  createFindManySelectorStub.restore();
  createGetSectionSelectorStub.restore();
});

test('findOne returns selector with given object type and filter', () => {
  // Given
  class TestObject extends ReduxObject {}
  const filter = { propA: 5 };

  const findOneSelector = {};
  createFindOneSelectorStub
    .withArgs(TestObject, filter)
    .returns(findOneSelector);

  // When
  const selector = findOne(TestObject, filter);

  // Then
  expect(selector).toBe(findOneSelector);
});

test('findMany returns selector with given object type and filter', () => {
  // Given
  class TestObject extends ReduxObject {}
  const filter = { propA: 5 };

  const findManySelector = {};
  createFindManySelectorStub
    .withArgs(TestObject, filter)
    .returns(findManySelector);

  // When
  const selector = findMany(TestObject, filter);

  // Then
  expect(selector).toBe(findManySelector);
});

test('getSection returns selector with given sectionDefinition', () => {
  // Given
  const sectionDefinition = {};

  const getSectionSelector = {};
  createGetSectionSelectorStub
    .withArgs(sinon.match.same(sectionDefinition))
    .returns(getSectionSelector);

  // When
  const selector = getSection(sectionDefinition);

  // Then
  expect(selector).toBe(getSectionSelector);
});
