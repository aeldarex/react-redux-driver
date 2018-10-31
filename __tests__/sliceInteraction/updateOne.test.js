import sinon from 'sinon';
import updateOne from '../../src/sliceInteraction/updateOne';

test('returns copy of given item with updates applied', () => {
  // Given
  class SomeObject {}

  const obj1 = new SomeObject();
  obj1.propA = 10;
  obj1.propB = { propC: 5 };

  // When
  const result = updateOne(obj1, { propA: 5 });

  // Then
  expect(result).not.toBe(obj1);
  expect(result).toBeInstanceOf(SomeObject);
  expect(result).toEqual({ propA: 5, propB: { propC: 5 } });
});

describe('if function tree fails update with error', () => {
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
    updateOne(obj1, { propA: x => x.concat('or more') });

    // Then
    expect(
      errorStub.calledWith(
        `Warning: Failed to update ${JSON.stringify(
          obj1,
        )} due to the following error: TypeError: x.concat is not a function`,
      ),
    ).toBe(true);
  });

  test('if function tree fails update with error returns null', () => {
    // Given
    const obj1 = { propA: 10 };

    // When
    const result = updateOne(obj1, { propA: x => x.concat('or more') });

    // Then
    expect(result).toBeNull();
  });
});
