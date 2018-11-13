import ReduxSection from '../../src/ReduxSection';
import { updateSection } from '../../src/driverActions/sectionActions';
import { DRIVER_UPDATE_SECTION } from '../../src/actionTypes';

describe('updateSection', () => {
  test('returns action with type of DRIVER_UPDATE_SECTION', () => {
    // When
    const result = updateSection();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_SECTION);
  });

  test('if given sectionType does not extend ReduxSection, returns action with empty payload', () => {
    // Given
    const sectionName = 'someSection';

    // When
    const result = updateSection(sectionName);

    // Then
    expect(result.payload).toEqual({});
  });

  test('if given sectionType does extend ReduxSection, returns action with sectionName from ReduxSection.stateSlice and update', () => {
    // Given
    class Auth extends ReduxSection {}

    const update = { propA: 5 };

    // When
    const result = updateSection(Auth, update);

    // Then
    expect(result.payload).toEqual({
      sectionName: 'Auth',
      update,
    });
  });
});
