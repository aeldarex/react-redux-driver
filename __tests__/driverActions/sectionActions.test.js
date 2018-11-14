import {
  updateSection,
  resetSection,
} from '../../src/driverActions/sectionActions';
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

describe('resetSection', () => {
  test('returns action with type of DRIVER_UPDATE_SECTION', () => {
    // When
    const result = resetSection();

    // Then
    expect(result.type).toBe(DRIVER_UPDATE_SECTION);
  });

  test('if given sectionDefinition does not have a stateSlice string property or defaultState prop, returns action with empty sectionName and update', () => {
    // When
    const result = resetSection({});

    // Then
    expect(result.payload).toEqual({
      sectionName: '',
      update: {},
    });
  });

  test('if given sectionDefinition does have a stateSlice and defaultState, returns action with stateSlice value as sectionName and defaultState as update', () => {
    // Given
    const sectionName = 'SomeSectionName';
    const defaultState = { propA: 0, propB: 10 };

    // When
    const result = resetSection({ stateSlice: sectionName, defaultState });

    // Then
    expect(result.payload).toEqual({
      sectionName,
      update: defaultState,
    });
  });
});
