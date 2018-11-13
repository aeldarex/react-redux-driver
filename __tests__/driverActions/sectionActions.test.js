import { updateSection } from '../../src/driverActions/sectionActions';
import { DRIVER_UPDATE_SECTION } from '../../src/actionTypes';

describe('updateSection', () => {
  test('returns action with type of DRIVER_UPDATE_SECTION', () => {
    // When
    const result = updateSection();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_SECTION);
  });

  test('if given sectionDefinition does not have a stateSlice string property, returns action with empty sectionName', () => {
    // Given
    const update = { propA: 5 };

    // When
    const result = updateSection({}, update);

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      update,
    });
  });

  test('if given sectionDefinition does have a stateSlice string property, returns action with stateSlice value as sectionName', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const update = { propA: 5 };

    // When
    const result = updateSection({ stateSlice: sectionName }, update);

    // Then
    expect(result.payload).toEqual({
      sectionName,
      update,
    });
  });
});
