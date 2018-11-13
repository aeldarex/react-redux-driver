import sinon from 'sinon';
import createObjectCopyWithUpdates from '../../src/utils/createObjectCopyWithUpdates';

test('returns copy of given item with updates applied', () => {
  // Given
  const object1 = { propA: 10, propB: { propC: 5 } };

  const updateFunction = (x) => {
    x.propA = 5; // eslint-disable-line no-param-reassign
  };

  // When
  const result = createObjectCopyWithUpdates(object1, updateFunction);

  // Then
  expect(result).not.toBe(object1);
  expect(result).toEqual({ propA: 5, propB: { propC: 5 } });
});

describe('if update function throws error', () => {
  let errorStub;

  beforeAll(() => {
    errorStub = sinon.stub(console, 'error');
  });

  afterEach(() => {
    errorStub.reset();
  });

  afterAll(() => {
    errorStub.restore();
  });

  test('if function tree fails update with error produces warning', () => {
    // Given
    const obj1 = { propA: 10 };

    // When
    createObjectCopyWithUpdates(obj1, () => {
      throw new Error('bad update');
    });

    // Then
    expect(
      errorStub.calledWith(
        `Warning: Failed to update ${JSON.stringify(
          obj1,
        )} due to the following error: Error: bad update`,
      ),
    ).toBe(true);
  });

  test('if function tree fails update with error returns null', () => {
    // Given
    const obj1 = { propA: 10 };

    // When
    const result = createObjectCopyWithUpdates(obj1, () => {
      throw new Error('bad update');
    });

    // Then
    expect(result).toBeNull();
  });
});
