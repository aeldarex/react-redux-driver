import sinon from 'sinon';
import * as CreateFindOneSelectorModule from '../src/selectorCreation/createFindOneSelector';
import * as CreateFindManySelectorModule from '../src/selectorCreation/createFindManySelector';
import * as CreateGetSectionSelectorModule from '../src/selectorCreation/createGetSectionSelector';
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

test('findOne returns selector for given sectionName and filter', () => {
  // Given
  const sectionName = 'SomeSectionName';
  const filter = { propA: 5 };

  const findOneSelector = {};
  createFindOneSelectorStub
    .withArgs(sectionName, filter)
    .returns(findOneSelector);

  // When
  const selector = findOne(sectionName, filter);

  // Then
  expect(selector).toBe(findOneSelector);
});

test('findMany returns selector with given object type and filter', () => {
  // Given
  const sectionName = 'SomeSectionName';
  const filter = { propA: 5 };

  const findManySelector = {};
  createFindManySelectorStub
    .withArgs(sectionName, filter)
    .returns(findManySelector);

  // When
  const selector = findMany(sectionName, filter);

  // Then
  expect(selector).toBe(findManySelector);
});

test('getSection returns selector with given sectionDefinition', () => {
  // Given
  const sectionName = 'SomeSectionName';

  const getSectionSelector = {};
  createGetSectionSelectorStub
    .withArgs(sectionName)
    .returns(getSectionSelector);

  // When
  const selector = getSection(sectionName);

  // Then
  expect(selector).toBe(getSectionSelector);
});
