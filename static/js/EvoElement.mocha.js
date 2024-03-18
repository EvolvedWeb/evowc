import { expect } from 'chai';
import { sleep } from './EvoElement.js';
let propFromAttr;
let isObject;
let boolFromVal;
let setAttr;
let sameObjs;
let sameDates;
let cond;
let ael;
let comment;
let EvoElement
let qs = null;
let qsAll = [];

const STYLE_QS_RE = /style\[component="(?<name>[^"]*)"\]/;
const ELS_RE = /\[_cid="(?<cid>[^"]+)"\]/;
// eslint-disable-next-line no-unused-vars
function locateElElements(el, cid) {
  return [];
}
function locateScriptElement(el, name) {
  if (el) {
    if (el.attrs?.component === name) {
      return el;
    }

    if (el.children.length > 0) {
      let child = null;
      el.children.some(childEl => {
        const temp = locateScriptElement(childEl, name);
        if (temp) {
          child = childEl;
          return true;
        }
      });
      return child;
    }
  }

  return null;
}
let elementId = 0;
class HTMLElement extends EventTarget {
  constructor(name='noname') {
    super();
    this.name = name;
    this.id = elementId++;
    this.attrs = {};
    /** @type {HTMLElement}  */
    this.parent = null;
    /** @type {HTMLElement[]} */
    this.children = [];
    this.eventListeners = {};
    this._textContent = '';
    this._innerHTML = '';
    this.isConnected = false;

    if (name === 'document') {
      this.body = new HTMLElement('body');
      this.appendChild(this.body);
    }
  }
  after(otherEl) {
    if (!this.parent) {
      throw new Error('No parent, can not add');
    }
    if (otherEl.parent) {
      this.parent.children = this.parent.children.filter(el => el.id !== otherEl.id);
    }
    otherEl.parent = this.parent;
    const idx = this.parent.children.findIndex(el => el.id === this.id);
    if (idx === -1) {
      this.parent.children.push(otherEl);
    }
    else {
      this.parent.children.splice(idx+1, 0, otherEl);
    }
    otherEl.isConnected = true;
    if( otherEl.connectedCallback ) {
      otherEl.connectedCallback();
    }
  }
  before(otherEl) {
    if (!(otherEl instanceof HTMLElement)) {
      throw new Error('Invalid node. Can not be added.');
    }
    if (!this.parent) {
      throw new Error('No parent, can not add');
    }
    if (otherEl.parent) {
      this.parent.children = this.parent.children.filter(el => el.id !== otherEl.id);
    }
    otherEl.parent = this.parent;
    const idx = this.parent.children.findIndex(el => el.id === this.id);
    if (idx === -1) {
      this.parent.children.push(otherEl);
    }
    else {
      this.parent.children.splice(idx, 0, otherEl);
    }
    otherEl.isConnected = true;
    if (otherEl.connectedCallback) {
      otherEl.connectedCallback();
    }
  }
  attachShadow(options) {
    this.shadowRoot = new HTMLElement('shadow');
    this.shadowRoot.options = options;
    return this.shadowRoot;
  }
  createDocumentFragment() {
    return new HTMLElement('fragment');
  }
  append(otherEl) {
    this.children.push(otherEl);
    otherEl.parent = this;
    otherEl.isConnected = true;
    if (otherEl.connectedCallback) {
      otherEl.connectedCallback();
    }
  }
  appendChild(otherEl) {
    this.children.push(otherEl);
    otherEl.parent = this;
    otherEl.isConnected = true;
    if (otherEl.connectedCallback) {
      otherEl.connectedCallback();
    }
  }
  remove() {
    if (this.parent) {
      this.parent.children = this.parent.children.filter(el => el.id !== this.id);
      this.parent = null;
      this.isConnected = false;
      if (this.disconnectedCallback) {
        this.disconnectedCallback();
      }
    }
  }
  removeAttribute(attr) {
    if (this.observedAttributes?.includes(attr)) {
      if (this.attributeChangedCallback) {
        if (this.attrs[attr] == null) {
          this.attributeChangedCallback(attr, this.attrs[attr], null);
        }
      }
    }
    delete this.attrs[attr];
  }
  setAttribute(attr, value) {
    if (this.observedAttributes?.includes(attr)) {
      if (this.attributeChangedCallback) {
        if (this.attrs[attr] !== value) {
          this.attributeChangedCallback(attr, this.attrs[attr]??null, value??null);
        }
      }
    }
    this.attrs[attr] = value;
  }
  getAttribute(attr) {
    return this.attrs[attr] ?? null;
  }
  querySelector(selector) {
    let temp = STYLE_QS_RE.exec(selector);
    if (temp) {
      return locateScriptElement(this, temp.groups.name);
    }
    return qs || null;
  }
  querySelectorAll(selector) {
    let temp = ELS_RE.exec(selector);
    if (temp) {
      return locateElElements(this, temp.groups.cid);
    }
    return qsAll || [];
  }
  addEventListener(type, listener, options = {}) {
    const name = `${type}${options.capture?'_C':''}`
    this.eventListeners[name] ??= [];
    this.eventListeners[name].push({ listener, options });
  }
  removeEventListener(type, listener, options = {}) {
    const name = `${type}${options.capture ? '_C' : ''}`
    this.eventListeners[name] ??= [];
    let idx;

    do {
      idx = this.eventListeners[name].findIndex(el => el.listener === listener);
      if(idx !== -1) {
        this.eventListeners[name].splice(idx, 1);
      }
    } while( idx !== -1)
  }
  createComment(data) {
    const commentEl = new HTMLElement(data);
    commentEl.data = data;
    return commentEl;
  }
  createElement(type) {
    const el = new HTMLElement(type);
    el.nodeName = el.tagName = type.toUpperCase();
    return el;
  }
  display() {
    let resp = [this.name, ...(this.children.map(el => el.display()).flat(Infinity))];
    return resp;
  }
  get textContent() {
    return this._textContent;
  }
  set textContent(text) {
    this._textContent = text;
    this._innerHTML = text;
  }
  get innerHTML() {
    return this._textContent;
  }
  set innerHTML(text) {
    this._textContent = text;
    this._innerHTML = text;
  }
}
// @ts-ignore
global.HTMLElement = HTMLElement;

// eslint-disable-next-line no-unused-vars
function JSONReplacer(key, value) {
  if (key === 'parent' && value != null) {
    return '<--- recursion'; // Exclude 'parent' from JSON
  }
  return value; // Include other properties in JSON
}

describe('EvoElement tests', () => {
  before(async () => {
    const module = await import('./EvoElement.js');
    ({ propFromAttr, isObject, boolFromVal, setAttr, sameObjs, sameDates, cond, ael, comment, EvoElement } = module);
  });

  beforeEach(() => {
    // @ts-ignore
    global.document = new HTMLElement('document');
  })
  afterEach(() => {
    global.document = null;
  });

  it('should pass propFromAttr tests', () => {
    expect(propFromAttr()).to.equal('');
    expect(propFromAttr('')).to.equal('');
    expect(propFromAttr('this-thing')).to.equal('thisThing');
    expect(propFromAttr('thisThing')).to.equal('thisThing');
  });

  it('should pass isObject tests', () => {
    expect(isObject()).to.equal(false);
    expect(isObject(null)).to.equal(false);
    expect(isObject(undefined)).to.equal(false);
    expect(isObject(false)).to.equal(false);
    expect(isObject(10)).to.equal(false);
    expect(isObject('str')).to.equal(false);
    expect(isObject([1, 2])).to.equal(true);
    expect(isObject({ a: 10 })).to.equal(true);
  });

  it('should pass boolFromVal tests', () => {
    expect(boolFromVal()).to.equal(null);
    expect(boolFromVal(null)).to.equal(null);
    expect(boolFromVal(undefined)).to.equal(null);
    expect(boolFromVal('')).to.equal(true);
    expect(boolFromVal(true)).to.equal(true);
    expect(boolFromVal(false)).to.equal(false);
    expect(boolFromVal('true')).to.equal(true);
    expect(boolFromVal('false')).to.equal(false);
    expect(boolFromVal(1)).to.equal(true);
    expect(boolFromVal(0)).to.equal(false);
    expect(boolFromVal('1')).to.equal(true);
    expect(boolFromVal('0')).to.equal(false);
  });

  it('should pass setAttr tests', () => {
    const { body } = document
    function noEl() {
      // @ts-ignore
      setAttr();
    }
    function noAttr() {
      // @ts-ignore
      setAttr(body);
    }

    expect(noEl).to.throw('Invalid element provided to setAttr');
    expect(noAttr).to.throw('Invalid attr provided to setAttr');
    // @ts-ignore
    setAttr(body, 'dog', true);
    // @ts-ignore
    expect(body.attrs.dog).to.equal('');
    setAttr(body, 'dog', null);
    // @ts-ignore
    expect(body.attrs).to.eql({});
    setAttr(body, 'dog', 'true');
    // @ts-ignore
    expect(body.attrs.dog).to.equal('true');
  });

  it('should pass sameObjs tests', () => {
    const temp = {a:1,b:2,c:3,d:"4",e:[1,2,{x:1,y:2,z:{d:'dog'}}]};
    expect(sameObjs(temp, temp)).to.equal(true);
    expect(sameObjs(temp, structuredClone(temp))).to.equal(true);
    expect(sameObjs(temp, 10)).to.equal(false);
    expect(sameObjs({a:10,b:20}, {b:20,a:10})).to.equal(true);
  });

  it('should pass sameDates tests', () => {
    const temp = new Date();
    expect(sameDates(temp, temp)).to.equal(true);
    expect(sameDates(temp, structuredClone(temp))).to.equal(true);
    expect(sameDates(temp, 10)).to.equal(false);
    const temp2 = new Date();
    temp2.setDate(temp2.getDate()+1);
    expect(sameDates(temp, temp2)).to.equal(false);
  });

  it('should pass cond tests', () => {
    const { body } = document;
    const commentEl = new HTMLElement('comment');
    const condEl = new HTMLElement('condEl');

    // @ts-ignore
    body.append(new HTMLElement('a'));
    // @ts-ignore
    body.append(commentEl);
    // @ts-ignore
    body.append(new HTMLElement('z'));
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'z']);

    cond(condEl, commentEl, 10, 10);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'condEl', 'z']);

    cond(condEl, commentEl, 10, 9);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'z']);

    cond(condEl, commentEl, 10, [true, 0, 20]);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'z']);

    cond(condEl, commentEl, 10, [false, 0, 20]);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'condEl', 'z']);

    cond(condEl, commentEl, 10, [false, 0]);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'condEl', 'z']);

    cond(condEl, commentEl, 10, [true, 0]);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'z']);

    cond(condEl, commentEl, 10, [false, null, 100]);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', 'comment', 'condEl', 'z']);

    function fail() {
      cond(condEl, commentEl, 10, [false, null, null]);
    }

    expect(fail).to.throw('A min, max, or both values must be provided. They can not both be null');
  });

  it('should pass comment tests', () => {
    const { body } = document;
    const condEl = new HTMLElement('condEl');

    // @ts-ignore
    body.append(new HTMLElement('a'));
    // @ts-ignore
    body.append(condEl);
    // @ts-ignore
    body.append(new HTMLElement('z'));
    const commentEl = comment('zap', condEl);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', '  zap  ', 'condEl', 'z']);
    cond(condEl, commentEl, 10, false);
    // @ts-ignore
    expect(body.display()).to.eql(['body', 'a', '  zap  ', 'z']);
  });

  it('should pass ael tests', () => {
    const { body } = document;

    const listener1 = () => {};
    const listener2 = () => { };
    let remove1 = ael(body, 'click', listener1) ;
    let remove2 = ael(body, 'click', listener2, {capture: true});
    // @ts-ignore
    expect(body.eventListeners).to.eql({
      click: [
        {
          listener: listener1,
          options: {
            capture: false,
            once: false,
            passive: false
          }
        }
      ],
      click_C: [
        {
          listener: listener2,
          options: {
            capture: true,
            once: false,
            passive: false
          }
        }
      ]
    });

    remove2();
    // @ts-ignore
    expect(body.eventListeners).to.eql({
      click: [
        {
          listener: listener1,
          options: {
            capture: false,
            once: false,
            passive: false
          }
        }
      ],
      click_C: []
    });

    remove1();
    // @ts-ignore
    expect(body.eventListeners).to.eql({ click: [], click_C: [] });

    function fail() {
      ael(body, 'click', 'listener1');
    }

    expect(fail).to.throw('Please provide proper arguments when calling ael(element, type, listener, options)');
  });

  describe('EvoElement class tests', () => {
    beforeEach(() => {
      qs = null;
      qsAll = [];
    });

    it('should create instance of EvoElement', () => {
      class Test extends EvoElement() {}
      const test = new Test();
      expect(test instanceof HTMLElement).to.equal(true);
      expect(test instanceof Test).to.equal(true);
    });

    it('createDom should work with no template and no styles', () => {
      class Test extends EvoElement() { }
      const test = new Test();
      test.createDom({ template: '', styles: '', shadowMode: 'open', componentName: 'test-element' });
    });

    it('createDom should work with no template and with styles', async () => {
      class Test extends EvoElement() {
        constructor() {
          super();
          this.updateCalled = 0;
          this.connectedCalled = 0;
          this.disconnectedCalled = 0;
        }
        update() {
          this.updateCalled++;
        }
        connected() {
          this.connectedCalled++;
        }
        disconnected() {
          this.disconnectedCalled++;
        }
      }
      const test = new Test();
      test.createDom({ template: '', styles: '.dog{background:red}', shadowMode: 'open', componentName: 'test-element' });
      // @ts-ignore
      expect(test.updateCalled).to.equal(0, 'test.updateCalled');
      expect(test.connectedCalled).to.equal(0, 'test.connectedCalled');
      expect(test.disconnectedCalled).to.equal(0, 'test.disconnectedCalled');

      await test.callUpdate({ cpa: 'dog', oldVal: null, newVal: 'woof' });
      // @ts-ignore
      document.body.appendChild(test);
      await sleep(100);
      expect(test.updateCalled).to.equal(1, 'test.updateCalled');
      expect(test.connectedCalled).to.equal(1, 'test.connectedCalled');
      expect(test.disconnectedCalled).to.equal(0, 'test.disconnectedCalled');

      test.remove();
      expect(test.updateCalled).to.equal(1, 'test.updateCalled');
      expect(test.connectedCalled).to.equal(1, 'test.connectedCalled');
      expect(test.disconnectedCalled).to.equal(1, 'test.disconnectedCalled');

      // @ts-ignore
      document.body.appendChild(test);
      await sleep(100);
      await test.callUpdate({ cpa: 'cow', oldVal: null, newVal: 'moo' });
      await sleep(100);
      expect(test.updateCalled).to.equal(2, 'test.updateCalled');
      expect(test.connectedCalled).to.equal(2, 'test.connectedCalled');
      expect(test.disconnectedCalled).to.equal(1, 'test.disconnectedCalled');

      expect(test.shadowRoot.children.length).to.equal(1, 'test.shadowRoot.children.length'); // Make sure we didn't add a second style tag
    });

    it('attributeChangedCallback should work', () => {
      return new Promise((resolve) => {
        class Test extends EvoElement() {
          // We know observedAttributes should be static. But the test version of HTMLElement
          // can't access the static version. So we emulate it not being static.
          get observedAttributes() {
            return ['aaa'];
          }
          #_aaa = null;

          get aaa() {
            return this.#_aaa;
          }
          set aaa(newVal) {
            this.#_aaa = newVal;
          }
        }
        const test = new Test();
        test.createDom({ template: '', styles: '', shadowMode: 'open', componentName: 'test-element' });
        expect(test.aaa).to.equal(null);
        test.setAttribute('aaa', 'one');
        setTimeout(() => {
          // The timeout is currently needed because attributeChangedCallback
          // sets the properties in a timeout
          expect(test.aaa).to.equal('one');
          resolve();
        }, 10);
      });
    });

    it('onUpdate should work', async () => {
      let thingUpdateIdx = 0
      let thingUpdateExpected = {};
      let testUpdateIdx = 0
      let testUpdateExpected = {};
      class Test extends EvoElement() {
        init() {
          this.remove1 = this.onUpdate('thing', this.#thingUpdate)
          this.remove2 = this.onUpdate('thing', this.#thingUpdate2)
          this.remove3 = this.onUpdate('test', this.#testUpdate)
          expect(this.remove1).to.be.a('function');
        }

        #thingUpdate(params) {
          expect(thingUpdateIdx).to.equal(0);
          thingUpdateIdx = 1;
          expect(params).to.eql(thingUpdateExpected)
        }
        #thingUpdate2(params) {
          expect(thingUpdateIdx).to.equal(1);
          thingUpdateIdx = 2;
          expect(params).to.eql(thingUpdateExpected)
        }
        #testUpdate(params) {
          testUpdateIdx++;
          expect(params).to.eql(testUpdateExpected)
        }
      }

      const test = new Test();
      test.init();
      test.isConnected = true;
      thingUpdateExpected = {cpa: 'thing', oldVal: null, newVal: 'new'};
      thingUpdateIdx = 0;
      await test.callUpdate(thingUpdateExpected);
      expect(thingUpdateIdx).to.equal(2);

      testUpdateExpected = { cpa: 'test', oldVal: 'new', newVal: 'this is a longer value' };
      testUpdateIdx = 0;
      await test.callUpdate(testUpdateExpected);
      expect(testUpdateIdx).to.equal(1);

      thingUpdateExpected = { cpa: 'thing', oldVal: 'new', newVal: 'this is a longer value' };
      thingUpdateIdx = 0;
      if (typeof test.remove2 === 'function') {
        test.remove2();
      }
      await test.callUpdate(thingUpdateExpected);
      expect(thingUpdateIdx).to.equal(1);

      thingUpdateExpected = { cpa: 'thing', oldVal: 'new', newVal: 'this is a longer value' };
      thingUpdateIdx = 0;
      if (typeof test.remove1 === 'function') {
        test.remove1();
      }
      await test.callUpdate(thingUpdateExpected);
      expect(thingUpdateIdx).to.equal(0);


      testUpdateExpected = { cpa: 'test', oldVal: 'new', newVal: 'this is a longer value' };
      testUpdateIdx = 0;
      if (typeof test.remove3 === 'function') {
        test.remove3();
      }
      await test.callUpdate(testUpdateExpected);
      expect(testUpdateIdx).to.equal(0);
    });

    it('invalid onUpdate should work', async () => {
      class Test extends EvoElement() {
        testUpdate() {
          expect.fail('The method #testUpdate should not have been called');
        }
      }
      const test = new Test();

      function badCPA() {
        test.onUpdate([1], test.testUpdate);
      }
      expect(badCPA).to.throw('The CPA (1) must be a string.');

      function badCallback() {
        test.onUpdate(['er'], null);
      }
      expect(badCallback).to.throw('The callback must be a function.');
    });
  });
});
