/* eslint-env mocha */
const expect = require('chai').expect;
const getImports = require('./getImports');

describe('getImports tests', function () {
  it('should only get EvoElement with no script and not need', () => {
    const properties = {};
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get everything from script', () => {
    const properties = {};
    const rootScript = '';
    const classScript = 'boolFromVal comment cond sameDates ael sameObjs setAttr';

    const expected = [
      'EvoElement',
      'boolFromVal',
      'setAttr',
      'cond',
      'sameObjs',
      'sameDates',
      'comment',
      'ael'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get boolFromVal from properties', () => {
    const properties = {
      bool: {
        type: 'bool',
        setHostAttr: null,
        elements: {}
      }
    };

    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'boolFromVal'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get sameObjs from type OBJ in properties', () => {
    const properties = {
      obj: {
        type: 'obj',
        setHostAttr: null,
        elements: {}
      },
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'sameObjs'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get sameObjs from type ARR in properties', () => {
    const properties = {
      obj: {
        type: 'arr',
        setHostAttr: null,
        elements: {}
      },
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'sameObjs'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get setAttr from setHostAttr in properties', () => {
    const properties = {
      setHostAttr: {
        type: 'str',
        setHostAttr: 'something',
        elements: {}
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'setAttr'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get setAttr from ARIA in bindings in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          bindingAria: {
            binding: [
              { type: 'aria' }
            ],
            conditional: null,
            forLoop: null,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'setAttr'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });


  it('should get setAttr from ATTR in bindings in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          bindingAria: {
            binding: [
              { type: 'attr' }
            ],
            conditional: null,
            forLoop: null,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'setAttr'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get sameDates from properties', () => {
    const properties = {
      date: {
        type: 'date',
        setHostAttr: null,
        elements: {}
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'sameDates'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get setAttr and comment from forLoop in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          forLoop: {
            binding: null,
            conditional: null,
            forLoop: true,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'setAttr',
      'comment'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get cond and comment from conditional in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          conditional: {
            binding: null,
            conditional: true,
            forLoop: null,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'cond',
      'comment'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get usesEvents from events in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          events: {
            binding: null,
            conditional: null,
            forLoop: null,
            events: { a: 1 }
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'ael'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get usesEvents from add2WayBinding in properties', () => {
    const properties = {
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          twowaybinding: {
            binding: [
              { add2WayBinding: true }
            ],
            conditional: null,
            forLoop: null,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'ael'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });

  it('should get everything from properties', () => {
    const properties = {
      noelements: {
        type: null,
        setHostAttr: null
      },
      bool: {
        type: 'bool',
        setHostAttr: null,
        elements: {}
      },
      obj: {
        type: 'obj',
        setHostAttr: null,
        elements: {}
      },
      date: {
        type: 'date',
        setHostAttr: null,
        elements: {}
      },
      setHostAttr: {
        type: 'str',
        setHostAttr: 'something',
        elements: {}
      },
      elements: {
        type: 'str',
        setHostAttr: null,
        elements: {
          conditional: {
            binding: null,
            conditional: true,
            forLoop: null,
            events: null
          },
          forLoop: {
            binding: null,
            conditional: null,
            forLoop: true,
            events: null
          },
          bindingAria: {
            binding: [
              {type: 'aria'}
            ],
            conditional: null,
            forLoop: null,
            events: null
          },
          bindingAttr: {
            binding: [
              { type: 'attr' }
            ],
            conditional: null,
            forLoop: null,
            events: null
          },
          events: {
            binding: null,
            conditional: null,
            forLoop: null,
            events: {a:1}
          },
          twowaybinding: {
            binding: [
              { add2WayBinding: true }
            ],
            conditional: null,
            forLoop: null,
            events: null
          }
        }
      }
    };
    const rootScript = '';
    const classScript = '';

    const expected = [
      'EvoElement',
      'boolFromVal',
      'setAttr',
      'cond',
      'sameObjs',
      'sameDates',
      'comment',
      'ael'
    ];
    expect(getImports(properties, rootScript, classScript)).to.eql(expected);
  });
});
