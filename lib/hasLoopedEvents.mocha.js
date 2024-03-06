import { expect } from 'chai';
import { hasLoopedEvents } from './hasLoopedEvents.js';

const loopedEventData = {
  "people": {
    "elements": {
      "els.fel1": {
        "forLoop": {
          "forEventInfo": [
            "ael( els.fel7, 'input', (evt)=>this.#name_onInputHandler_0(evt, {...evt.target.dataset}, _index, item))"
          ]
        }
      }
    },
  }
}

describe('hasLoopedEvents tests', function () {
  it('should return false is there are no looped events', () => {
    expect(hasLoopedEvents({})).to.equal(false);
  });

  it('should return true is there are looped events', () => {
    expect(hasLoopedEvents(loopedEventData)).to.equal(true);
  });
});
