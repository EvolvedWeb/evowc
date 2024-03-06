import { expect } from 'chai';
import { sortPropertyEntities } from './sortPropertyEntities.js';

describe('sortPropertyEntities tests', function () {
  it('should sort simple things', () => {
    expect(sortPropertyEntities(['bank', 1],['live', 2])).to.equal(-1, "['bank', 1],['live', 2]");
    expect(sortPropertyEntities(['zed', 1], ['alpha', 2])).to.equal(1, "['zed', 1], ['alpha', 2]");
    expect(sortPropertyEntities(['mine', 1], ['mine', 2])).to.equal(0, "['mine', 1], ['mine', 2]");
  });

  it('should create a sorted list based on keys', () => {
    const propertyEntries = {
      'live': 2,
      '#val': 3,
      'bank': 1,
      'alpha': 0,
      '#zed': 4,
    };
    const expected = [
      ['alpha', 0],
      ['bank', 1],
      ['live', 2],
      ['#val', 3],
      ['#zed', 4]
    ];
    const entries = Object.entries(propertyEntries)
    entries.sort(sortPropertyEntities);
    expect(entries).to.eql(expected);
  });
});
