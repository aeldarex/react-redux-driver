import sinon from 'sinon';
import updateMany from '../../src/sliceInteraction/updateMany';

test('creates copy of all objects with updates', () => {
  // Given
  const object1 = { propA: 5, propB: 10 };
  const object2 = { propA: 50, propB: 100 };
  const update = { propA: 10 };

  // When
  const updatedObjects = updateMany(
    [{ index: 2, object: object1 }, { index: 5, object: object2 }],
    update,
  );

  // Then
  expect(updatedObjects.length).toBe(2);
  expect(updatedObjects[0].object).not.toBe(object1);
  expect(updatedObjects[1].object).not.toBe(object2);
  expect(updatedObjects[0]).toEqual({
    index: 2,
    object: { propA: 10, propB: 10 },
  });
  expect(updatedObjects[1]).toEqual({
    index: 5,
    object: { propA: 10, propB: 100 },
  });
});

describe('when some objects fail to update', () => {
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

  test('the objects which failed to update are not included', () => {
    // Given
    const object1 = { propA: '1', propB: 10 };
    const object2 = { propA: 50, propB: 100 };
    const update = { propA: x => x.concat('0') };

    // When
    const updatedObjects = updateMany(
      [{ index: 2, object: object1 }, { index: 5, object: object2 }],
      update,
    );

    // Then
    expect(updatedObjects.length).toBe(1);
    expect(updatedObjects[0].object).not.toBe(object1);
    expect(updatedObjects[0]).toEqual({
      index: 2,
      object: { propA: '10', propB: 10 },
    });
  });
});
