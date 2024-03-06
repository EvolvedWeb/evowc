import { expect } from 'chai';
let toUpper;
let toLower;
let toJson;
let toCurrency;
let toDate;
let toDecimal;
let toPercent;

// @ts-ignore
global.document = {
  documentElement: {
    lang: null
   }
};
// @ts-ignore
global.navigator = {
  language: 'en-US'
};

describe('EvoPipes tests', () => {
  before(async () => {
    const EvoPipes = await import('./EvoPipes.js');
    ({ toUpper, toLower, toJson, toCurrency, toDate, toDecimal, toPercent } = EvoPipes);
  });

  it('should handled toUpper(str)', () => {
    expect(toUpper('testing')).to.equal('TESTING');
    const source = 'áàâäãåāăąćčçćĉċèéêëēĕėęěğĝġģĥħìíîïīĩįiĳĵķĸĺļľŀłñńņňŉòóôöõøōŏőœĝŕřŗśŝşšţťŧùúûüũūŭůűųŵÿýŷźżžż';
    const expected = 'ÁÀÂÄÃÅĀĂĄĆČÇĆĈĊÈÉÊËĒĔĖĘĚĞĜĠĢĤĦÌÍÎÏĪĨĮIĲĴĶĸĹĻĽĿŁÑŃŅŇʼNÒÓÔÖÕØŌŎŐŒĜŔŘŖŚŜŞŠŢŤŦÙÚÛÜŨŪŬŮŰŲŴŸÝŶŹŻŽŻ';
    expect(toUpper(source)).to.equal(expected);
  });

  it('should handled toLower(str)', () => {
    expect(toLower('TESTING')).to.equal('testing');
    const source = 'ÁÀÂÄÃÅĀĂĄĆČÇĆĈĊÈÉÊËĒĔĖĘĚĞĜĠĢĤĦÌÍÎÏĪĨĮIĲĴĶĸĹĻĽĿŁÑŃŅŇÒÓÔÖÕØŌŎŐŒĜŔŘŖŚŜŞŠŢŤŦÙÚÛÜŨŪŬŮŰŲŴŸÝŶŹŻŽŻ';
    const expected = 'áàâäãåāăąćčçćĉċèéêëēĕėęěğĝġģĥħìíîïīĩįiĳĵķĸĺļľŀłñńņňòóôöõøōŏőœĝŕřŗśŝşšţťŧùúûüũūŭůűųŵÿýŷźżžż';
    expect(toLower(source)).to.equal(expected);
  });

  it('should handled toJson(item)', () => {
    expect(toJson('TESTING')).to.equal('"TESTING"');
    expect(toJson(10)).to.equal('10');
    expect(toJson([1,2,3,4])).to.equal('[1,2,3,4]');
    expect(toJson({ cat: 10, dog: [1, '2'], fish: 'blurb' })).to.equal('{"cat":10,"dog":[1,"2"],"fish":"blurb"}');
  });

  it('should handled toCurrency(num, data)', () => {
    expect(toCurrency(10, {})).to.equal('$10.00');
    expect(toCurrency(12.346, {})).to.equal('$12.35');
    expect(toCurrency(12.346, { locale: 'fr' })).to.equal('12,35\u00a0$US');
    expect(toCurrency(12.346, { locale: 'fr', currency: 'EUR' })).to.equal('12,35\u00a0€');
    expect(toCurrency(12.346, { currency: 'EUR' })).to.equal('€12.35');
  });

  it('should handled toDate(date, data)', () => {
    const date = new Date('1987-02-08T00:00:00.000Z')
    expect(toDate(date, { timeZone: 'UTC'})).to.equal('2/8/87');
    expect(toDate(date, { timeZone: 'UTC', dateStyle: 'short' })).to.equal('2/8/87', 'short');
    expect(toDate(date, { timeZone: 'UTC', dateStyle: 'medium' })).to.equal('Feb 8, 1987', 'medium');
    expect(toDate(date, { timeZone: 'UTC', dateStyle: 'long' })).to.equal('February 8, 1987', 'long');
    expect(toDate(date, { timeZone: 'UTC', dateStyle: 'full' })).to.equal('Sunday, February 8, 1987', 'full');
    expect(toDate(date, { locale: 'fr', timeZone: 'UTC', dateStyle: 'short' })).to.equal('08/02/1987', 'fr-short');
    expect(toDate(date, { locale: 'fr', timeZone: 'UTC', dateStyle: 'medium' })).to.equal('8 févr. 1987', 'fr-medium');
    expect(toDate(date, { locale: 'fr', timeZone: 'UTC', dateStyle: 'long' })).to.equal('8 février 1987', 'fr-long');
    expect(toDate(date, { locale: 'fr', timeZone: 'UTC', dateStyle: 'full' })).to.equal('dimanche 8 février 1987', 'fr-full');
    expect(toDate(date, { timeZone: 'UTC', dateStyle: 'yyyy-mm-dd' })).to.equal('1987-02-08', 'yyyy-mm-dd');
    expect(toDate(date, { timeZone: 'America/Los_Angeles', dateStyle: 'medium' })).to.equal('Feb 7, 1987', 'America/Los_Angeles-medium');
    expect(toDate(date, { locale: 'ja', timeZone: 'America/Los_Angeles', dateStyle: 'medium' })).to.equal('1987/02/07', 'ja-America/Los_Angeles-medium');
  });

  it('should handled toDecimal(num, data)', () => {
    expect(toDecimal(1234.56789)).to.equal('1,234.568');
    expect(toDecimal(1234.56789, {})).to.equal('1,234.568');
    expect(toDecimal(1234.56789, { decimalFormat: '' })).to.equal('1,234.568');
    expect(toDecimal(1234.56789, { decimalFormat: '0.2-2' })).to.equal('1,234.57');
    expect(toDecimal(1234.56789, { decimalFormat: '1.2-9' })).to.equal('1,234.56789');
    expect(toDecimal(1234.56789, { decimalFormat: '5.9' })).to.equal('01,234.567890000');
    expect(toDecimal(1234.56789, { decimalFormat: '5.9-9' })).to.equal('01,234.567890000');
    expect(toDecimal(1234.56789, { locale: 'fr-FR' })).to.equal('1\u202f234,568');
    expect(toDecimal(1234.56789, { locale: 'fr-FR', decimalFormat: '1.2-9' })).to.equal('1\u202f234,56789');
    expect(toDecimal(1234.56789, { locale: 'de' })).to.equal('1.234,568');
    expect(toDecimal(1234.56789, { locale: 'de', decimalFormat: '1.2-9' })).to.equal('1.234,56789');
  });

  it('should handled toPercent(num, data)', () => {
    expect(toPercent(1234.56789)).to.equal('123,457%');
    expect(toPercent(1234.56789, {})).to.equal('123,457%');
    expect(toPercent(1234.56789, { decimalFormat: '' })).to.equal('123,457%');
    expect(toPercent(1234.56789, { decimalFormat: '0.2-2' })).to.equal('123,456.79%');
    expect(toPercent(1234.56789, { decimalFormat: '1.2-9' })).to.equal('123,456.789%');
    expect(toPercent(1234.56789, { decimalFormat: '7.9' })).to.equal('0,123,456.789000000%');
    expect(toPercent(1234.56789, { decimalFormat: '7.5-5' })).to.equal('0,123,456.78900%');
    expect(toPercent(1234.56789, { locale: 'fr-FR' })).to.equal('123\u202f457\u00a0%');
    expect(toPercent(1234.56789, { locale: 'fr-FR', decimalFormat: '1.2-9' })).to.equal('123\u202f456,789\u00a0%');
    expect(toPercent(1234.56789, { locale: 'de' })).to.equal('123.457\u00a0%');
    expect(toPercent(1234.56789, { locale: 'de', decimalFormat: '1.2-9' })).to.equal('123.456,789\u00a0%');
  });
});
