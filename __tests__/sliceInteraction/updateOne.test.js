import sinon from 'sinon';
import updateOne from '../../src/sliceInteraction/updateOne';

test('creates copy of object with updates', () => {
  // Given
  const entry = { index: 5, object: { propA: 5 } };
  const update = { propA: 10 };

  // When
  const updatedEntry = updateOne(entry, update);

  // Then
  expect(updatedEntry).not.toBe(entry);
  expect(updatedEntry.object).not.toBe(entry.object);
  expect(updatedEntry).toEqual({ index: 5, object: { propA: 10 } });
});

describe('failed updates', () => {
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

  test('if update fails returns undefined', () => {
    // Given
    const entry = { index: 5, object: { propA: 5 } };
    const update = { propA: x => x.concat('0') };

    // When
    const updatedEntry = updateOne(entry, update);

    // Then
    expect(updatedEntry).not.toBeDefined();
  });
});
