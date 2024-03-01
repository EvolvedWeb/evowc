import { expect } from 'chai';
import { parseBinding } from './parseBinding.js';

describe('parseBinding tests', function () {
  it('should support a string CPA with no type:default', () => {
    const val = 'message';
    const element = 'this.#els.el4';
    const attribute = 'html';
    const type = 'prop';
    const availableVars = [
      'this',
      'this.message',
      'this.title',
      'this.icon',
      'this.state',
      'this.popup',
      'this.disabled'
    ];
    const forLoopStack = [];


    const expected = {
      add2WayBinding: false,
      attribute: 'html',
      default: undefined,
      forLoopItem: {
        forElementName: '',
        indexName: '',
        itemName: '',
        loopItemHandlerName: ''
      },
      inForLoop: false,
      inputSetter: undefined,
      pipes: undefined,
      prop: 'innerHTML',
      setterProp: 'newVal',
      srcField: 'message',
      srcObj: 'this',
      srcVar: 'this.message',
      type: 'prop'
    };

    const resp = parseBinding(val, element, attribute, type, availableVars, forLoopStack);
    expect(resp).to.eql(expected)
  });

  it('should process ARIA attributes', () => {
    const val = '#showText';
    const element = 'this.#els.el19';
    const attribute = 'label';
    const type = 'aria';
    const availableVars = [
      'this',
      'this.busy',
      'this.changePwButtonText',
      'this.changePwHref',
      'this.changePwMethod',
      'this.description',
      'this.errorMessage',
      'this.newPwAriaLabel',
      'this.newPwAriaLabel2',
      'this.oldPwAriaLabel',
      'this.title',
      'this.#currentPassword',
      'this.#newPassword',
      'this.#newPassword2',
      'this.#passwordType',
      'this.#showText',
      'this.#state',
      'this.#token',
      'this.#username'
    ];
    const forLoopStack = [];


    const expected = {
      add2WayBinding: false,
      attribute: 'label',
      default: undefined,
      forLoopItem: {
        forElementName: '',
        indexName: '',
        itemName: '',
        loopItemHandlerName: ''
      },
      inForLoop: false,
      inputSetter: undefined,
      pipes: undefined,
      prop: 'label',
      setterProp: 'newVal',
      srcField: '#showText',
      srcObj: 'this',
      srcVar: 'this.#showText',
      type: 'aria'
    };

    const resp = parseBinding( val, element, attribute, type, availableVars, forLoopStack);
    expect(resp).to.eql(expected)
  });

  it('should process attributes', () => {
    const val = '#style';
    const element = 'this.#els.el2';
    const attribute = 'style';
    const type = 'attr';
    const availableVars = [
      'this',
      'this.live',
      'this.rank',
      'this.showNum',
      'this.#style',
      'this.#val'
    ];
    const forLoopStack = [];

    const expected = {
      add2WayBinding: false,
      attribute: 'style',
      default: undefined,
      forLoopItem: {
        forElementName: '',
        indexName: '',
        itemName: '',
        loopItemHandlerName: ''
      },
      inForLoop: false,
      inputSetter: undefined,
      pipes: undefined,
      prop: 'style',
      setterProp: 'newVal',
      srcField: '#style',
      srcObj: 'this',
      srcVar: 'this.#style',
      type: 'attr'
    };

    const resp = parseBinding(val, element, attribute, type, availableVars, forLoopStack);
    expect(resp).to.eql(expected)
  });

  it('should process public camelCase property names', () => {
    const val = 'showFooter';
    const element = 'this.#els.dialog';
    const attribute = 'show-footer';
    const type = 'prop';
    const availableVars = [
      'this',
      'this.allowEsc',
      'this.description',
      'this.title',
      'this.minWidth',
      'this.minHeight',
      'this.showX',
      'this.showCancel',
      'this.showFooter',
      'this.okButtonText',
      'this.cancelButtonText',
      'this.#resolve',
      'this.#dialogStyle'
    ];
    const forLoopStack = [];

    const expected = {
      add2WayBinding: false,
      attribute: 'show-footer',
      default: undefined,
      forLoopItem: {
        forElementName: '',
        indexName: '',
        itemName: '',
        loopItemHandlerName: ''
      },
      inForLoop: false,
      inputSetter: undefined,
      pipes: undefined,
      prop: 'showFooter',
      setterProp: 'newVal',
      srcField: 'showFooter',
      srcObj: 'this',
      srcVar: 'this.showFooter',
      type: 'prop'
    };

    const resp = parseBinding(val, element, attribute, type, availableVars, forLoopStack);
    expect(resp).to.eql(expected)
  });

  it('should handle pipes', () => {
    const val = 'message|#doSomethingPipe|^toUpper';
    const element = 'this.#els.dogEl';
    const attribute = 'text';
    const type = 'prop';
    const availableVars = [
      'this',
      'this.message',
      'this.#localeDate'
    ];
    const forLoopStack = [];

    const expected = {
      add2WayBinding: false,
      attribute: 'text',
      default: undefined,
      forLoopItem: {
        forElementName: '',
        indexName: '',
        itemName: '',
        loopItemHandlerName: ''
      },
      inForLoop: false,
      inputSetter: undefined,
      pipes: [
        "this.#doSomethingPipe",
        "toUpper"
      ],
      prop: 'textContent',
      setterProp: 'newVal',
      srcField: 'message',
      srcObj: 'this',
      srcVar: 'this.message',
      type: 'prop'
    };

    const resp = parseBinding(val, element, attribute, type, availableVars, forLoopStack)
    expect(resp).to.eql(expected)
  });

  it('should process loops', () => {
    const val = '_index';
    const element = 'els.fel1';
    const attribute = 'idx';
    const type = 'attr';
    const availableVars = [
      'this',
      'this.addButtonText',
      'this.person',
      'this.reverseButtonText',
      'this.sortButtonText',
      'this.people',
      'this.aaa',
      'this.title',
      'this.#id',
      'this.#input',
      'item',
      '_index'
    ];
    const forLoopStack = [{
      forElementName: 'els.fel1',
      indexName: '_index',
      itemName: 'item',
      loopItemHandlerName: 'thing_handler1'
    }];

    const expected = {
      add2WayBinding: false,
      attribute: 'idx',
      default: undefined,
      forLoopItem: {
        forElementName: 'els.fel1',
        indexName: '_index',
        itemName: 'item',
        loopItemHandlerName: 'thing_handler1'
      },
      inForLoop: true,
      inputSetter: undefined,
      pipes: undefined,
      prop: 'idx',
      setterProp: '_index',
      srcField: '_index',
      srcObj: '_index',
      srcVar: '_index',
      type: 'attr'
    };

    const resp = parseBinding(val, element, attribute, type, availableVars, forLoopStack);
    expect(resp).to.eql(expected)
  });
});
