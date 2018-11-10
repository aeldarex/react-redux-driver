import { updateSection } from '../../src/driverActions/sectionActions';
import { DRIVER_UPDATE_SECTION } from '../../src/actionTypes';

describe('updateSection', () => {
  test('returns action with type of DRIVER_UPDATE_SECTION', () => {
    // When
    const result = updateSection();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_SECTION);
  });

  test('returns action with payload containing given sectionName', () => {
    // Given
    const sectionName = 'someSection';

    // When
    const result = updateSection(sectionName);

    // Then
    expect(result.payload.sectionName).toBe(sectionName);
  });

  test('returns action with payload containing given update', () => {
    // Given
    const update = {};

    // When
    const result = updateSection('someSection', update);

    // Then
    expect(result.payload.update).toBe(update);
  });
});
