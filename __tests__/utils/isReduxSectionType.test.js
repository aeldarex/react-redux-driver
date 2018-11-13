import isReduxSectionType from '../../src/utils/isReduxSectionType';
import ReduxSection from '../../src/ReduxSection';

test('given undefined returns false', () => {
  expect(isReduxSectionType(undefined)).toBe(false);
});

test('given null returns false', () => {
  expect(isReduxSectionType(null)).toBe(false);
});

test('given object type that does not extend ReduxSection', () => {
  expect(isReduxSectionType({})).toBe(false);
});

test('given object type that does extend ReduxSection', () => {
  // Given
  class Auth extends ReduxSection {}

  expect(isReduxSectionType(Auth)).toBe(true);
});
