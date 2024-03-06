import { expect } from 'chai';
import { getPipedVal } from './getPipedVal.js';

describe('getPipedVal tests', function () {
  it('should work without pipes', () => {
    const pipes = null;
    const setterProp = 'frog';
    const defaultVal = null;
    const el = 'someEl';

    const expected = 'frog ?? null';
    expect(getPipedVal({ pipes, setterProp, defaultVal }, el)).to.equal(expected);
  });

  it('should work with pipes', () => {
    const pipes = ['one','two'];
    const setterProp = 'frog';
    const defaultVal = null;
    const el = 'someEl';

    const expected = 'two(one(structuredClone(frog ?? null), someEl.dataset), someEl.dataset)';
    expect(getPipedVal({ pipes, setterProp, defaultVal }, el)).to.equal(expected);
  });
});
