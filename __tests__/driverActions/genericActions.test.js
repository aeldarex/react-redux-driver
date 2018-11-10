import { publishAction } from '../../src/driverActions/genericActions';

describe('publishAction', () => {
  test('returns action with given type', () => {
    // Given
    const actionType = 'SOME_ACTION_NAME';

    // When
    const result = publishAction(actionType);

    // Then
    expect(result.type).toBe(actionType);
  });

  test('returns action with given payload', () => {
    // Given
    const payload = {};

    // When
    const result = publishAction('SOME_ACTION_NAME', payload);

    // Then
    expect(result.payload).toBe(payload);
  });
});
