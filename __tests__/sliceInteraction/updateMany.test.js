import sinon from 'sinon';
import updateMany from '../../src/sliceInteraction/updateMany';

test('creates copy of all objects with updates', () => {
  // Given
  const object1 = { propA: 5, propB: 10 };
  const object2 = { propA: 50, propB: 100 };
  const update = { propA: 10 };

  // When
  const updatedObjects = updateMany([object1, object2], update);

  // Then
  expect(updatedObjects.length).toBe(2);
  expect(updatedObjects).not.toContain(object1);
  expect(updatedObjects).not.toContain(object2);
  expect(updatedObjects).toContainEqual({ propA: 10, propB: 10 });
  expect(updatedObjects).toContainEqual({ propA: 10, propB: 100 });
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
    const updatedObjects = updateMany([object1, object2], update);

    // Then
    expect(updatedObjects.length).toBe(1);
    expect(updatedObjects).not.toContain(object1);
    expect(updatedObjects).not.toContain(object2);
    expect(updatedObjects[0]).toEqual({ propA: '10', propB: 10 });
  });
});
