import isReduxObjectType from '../../src/utils/isReduxObjectType';
import ReduxObject from '../../src/ReduxObject';

test('given undefined returns false', () => {
  expect(isReduxObjectType(undefined)).toBe(false);
});

test('given null returns false', () => {
  expect(isReduxObjectType(null)).toBe(false);
});

test('given object type that does not extend ReduxObject', () => {
  expect(isReduxObjectType({})).toBe(false);
});

test('given object type that does extend ReduxObject', () => {
  // Given
  class TestObject extends ReduxObject {}

  expect(isReduxObjectType(TestObject)).toBe(true);
});
