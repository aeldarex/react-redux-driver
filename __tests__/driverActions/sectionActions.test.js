import { updateSection } from '../../src/driverActions/sectionActions';
import { DRIVER_UPDATE_SECTION } from '../../src/actionTypes';

test('updateSection returns DRIVER_UPDATE_SECTION action with sectionName and update in payload', () => {
  // Given
  const type = DRIVER_UPDATE_SECTION;
  const sectionName = 'SomeSectionName';
  const update = { propA: 5 };

  // When
  const result = updateSection(sectionName, update);

  // Then
  expect(result).toEqual({
    type,
    payload: {
      sectionName,
      update,
    },
  });
});
