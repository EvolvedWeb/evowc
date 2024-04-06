const VALID_DATE_STYLES = ['full', 'long', 'medium', 'short', undefined];
const DATE_OPTIONS_MAP = {
  yy: { key: 'year', value: '2-digit' },
  yyyy: { key: 'year', value: 'numeric' },
  m: { key: 'month', value: 'numeric' },
  mm: { key: 'month', value: '2-digit' },
  mmm: { key: 'month', value: 'short' },
  mmmm: { key: 'month', value: 'long' },
  d: { key: 'day', value: 'numeric' },
  dd: { key: 'day', value: '2-digit' }
};
const DATE_REPLACE_MAP = {
  year: /y+/g,
  month: /m+/g,
  day: /d+/g
}
const DECIMAL_SIZES_RE = /(\d+)\.?(\d*)-?(\d*)/;

/**
 * toUpper pipe: Transforms text to uppercase.
 * @param {string|any} str - The string to convert to uppercase. If a non-string is
 * passed in, it will be converted to a string.
 * @returns {string} - Uppercase version of the string
 * Example: <span :text="varName|toUpper"></span>
 */
export const toUpper = (str) => (''+str).toUpperCase();

/**
 * toLower pipe: Transforms text to lowercase.
 * @param {string|any} str - The string to convert to uppercase. If a non-string is
 * passed in, it will be converted to a string.
 * @returns {string} - Lowercase version of the string
 * Example: <span :text="varName|toLower"></span>
 */
export const toLower = (str) => (''+str).toLowerCase();
/**
 * toJson pipe: Transforms object to JSON object string.
 * @param {any} item - The item to convert to JSON object string.
 * @returns {string} - JSON object version of the string.
 * Example: <span :text="varName|toJson"></span>
 */
export const toJson = (item) => JSON.stringify(item);

/**
 * toCurrency pipe: Transforms a number to a currency string, formatted
 * according to locale rules.
 * @param {number|string} num - Number to convert to currency
 * @param {object} data - dataset from the component that called this pipe
 * @param {string} [data.locale] - A string with a BCP 47 language tag. For the general
 * form and interpretation of the locales argument, see the local description on
 * https://devdocs.io/javascript/global_objects/intl#locales_argument
 * @param {string} [data.currency] - The currency to use in currency formatting. Possible
 * values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for
 * the euro, or "CNY" for the Chinese RMB — see the Current currency & funds code list.
 * https://en.wikipedia.org/wiki/ISO_4217#List_of_ISO_4217_currency_codes
 * The default value is "USD";
 * @returns {string} - The value formatted as currency.
 * Example: <span :text="varName|toCurrency" data-currency="USD" data-locale="en-US"></span>
 */
export function toCurrency(num, data) {
  let { currency = 'USD', locale } = data || {};
  const options = { style: 'currency', currency };
  return new Intl.NumberFormat(getLocale(locale), options).format(Number(num));
}

/**
 * Date pipe: Formats a date value according to locale rules.
 * @param {Date|string} date - The date to be formatted
 * @param {object} [data] - dataset from the component that called this pipe
 * @param {string} [data.locale] - A string with a BCP 47 language tag. For the general
 * form and interpretation of the locales argument, see the local description on
 * https://devdocs.io/javascript/global_objects/intl#locales_argument
 * @param {string} [data.dateStyle] - The date formatting style. Possible values are
 * "full", "long", "medium", "short", or custom formatting "yyyy-mm-dd", "mmm d, yy", etc.
 * The default is "short"
 * Valid custom formatting options are: (For the date March 9 1987)
 *    "yyyy" -> "1987"
 *    "yy"   -> "87"
 *    "mmmm" -> "March"
 *    "mmm"  -> "Mar"
 *    "mm"   -> "03"
 *    "m"    -> "3"
 *    "dd"   -> "09"
 *    "d"    -> "9"
 * @param {string} [data.timeZone] - "America/Los_Angeles", "Africa/Bangui", "Asia/Bangkok",
 * "Atlantic/Bermuda", "Europe/Paris", "Pacific/Galapagos", etc.
 * The default is your machine's timezone.
 * `Intl.supportedValuesOf('timeZone')` returns all supported timezone strings.
 * Example: <span :text="varName|toDate" data-date-style="shortDate"
 * data-time-zone="America/Los_Angeles" data-locale="en-us"></span>
 */
export function toDate(date, data) {
  let { dateStyle = 'short', timeZone = undefined, locale } = data || {};
  date = new Date(date);
  if (!VALID_DATE_STYLES.includes(dateStyle)) {
    return toFormattedDate(date, locale, timeZone, dateStyle);
  }
  const options = { dateStyle, timeZone };
  // @ts-ignore
  return new Intl.DateTimeFormat(getLocale(locale), options).format(date)
}

/**
 * toDecimal pipe: Transforms a number into a string with an optional decimal point, formatted according to locale rules.
 * @param {number|string} num - The number to format
 * @param {object} [data] - 
 * @param {object} [data.decimalFormat] - 
 * @param {object} [data.locale] - 
 * Example: <span :text="varName|toDecimal" data-locale="en-US" data-decimal-format="1.2-2"></span>
 */
export function toDecimal(num, data) {
  const { locale, decimalFormat = '1.0-3' } = data || {};
  const { minIntDigits, minFracDigits, maxFracDigits } = getDecimalSizes(decimalFormat);
  const options = {
    minimumIntegerDigits: minIntDigits || 1,
    minimumFractionDigits: minFracDigits || 0,
    maximumFractionDigits: maxFracDigits || Math.max(3, minFracDigits || 0)
  }
  return new Intl.NumberFormat(getLocale(locale), options).format(Number(num));
}

/**
 * toPercent pipe: Transforms a number into a percent string with an optional decimal point, formatted according to locale rules.
 * @param {number|string} num - The number to format
 * @param {object} [data] - 
 * @param {object} [data.decimalFormat] - 
 * @param {object} [data.locale] - 
 * Example: <span :text="varName|toPercent" data-locale="en-US" data-decimal-format="1.0-0"></span>
 */
export function toPercent(num, data) {
  const { locale, decimalFormat = '1.0-0' } = data || {};
  const { minIntDigits, minFracDigits, maxFracDigits } = getDecimalSizes(decimalFormat);
  const options = {
    style: 'percent',
    minimumIntegerDigits: minIntDigits || 1,
    minimumFractionDigits: minFracDigits || 0,
    maximumFractionDigits: maxFracDigits || Math.max(0, minFracDigits || 0)
  }
  return new Intl.NumberFormat(getLocale(locale), options).format(Number(num));
}

// Helper functions
export function getLocale(locale) {
  return locale || document?.documentElement?.lang || navigator?.language || 'en-US';
}

/**
 * Convert a format string into a formatted Date string.
 * @param {Date} date 
 * @param {string} locale 
 * @param {string} timeZone 
 * @param {string} formatStr 
 * Supports the following:
 * "yyyy" - 4 digit year
 * "yy" - 2 digit year
 * "mmmm" - Full month string
 * "mmm" - Short month string
 * "mm" - 2 digit month
 * "m" - 1 or 2 digit month
 * "dd" - 2 digit date
 * "d" - 1 or 2 digit date
 * @returns {string} - Formatted date string
 */
export function toFormattedDate(date, locale, timeZone, formatStr) {
  // Convert our date format string into Intl.DateTimeFormat options
  let partsOptions = {};
  for (const [format, { key, value }] of Object.entries(DATE_OPTIONS_MAP)) {
    if (formatStr.includes(format)) {
      partsOptions[key] = value;
    }
  }

  if (timeZone) {
    partsOptions.timeZone = timeZone;
  }

  // Use Intl.DateTimeFormat with the options we collected
  const formatter = new Intl.DateTimeFormat(locale, partsOptions);
  const parts = formatter.formatToParts(date);

  // Create a map from the parts
  const partsMap = parts.reduce((acc, part) => {
    if (part.type !== 'literal') {
      acc[part.type] = part.value;
    }
    return acc;
  }, {});

  // Construct the final string based on the formatStr
  return Object.entries(DATE_REPLACE_MAP).reduce((acc, [part, re]) => {
    return acc.replace(re, partsMap[part])
  }, formatStr);
}


export function getDecimalSizes(decimalFormat) {
  const match = decimalFormat.match(DECIMAL_SIZES_RE) ?? [];
  // eslint-disable-next-line no-unused-vars
  const [_, minIntDigits, minFracDigits, maxFracDigits] = match.map(Number);
  return { minIntDigits, minFracDigits, maxFracDigits };
}

/*
Relative Time pipe ideas:
https://github.com/github/relative-time-element/blob/main/src/relative-time-element.ts
Only make it much simpler

Intl.durationFormat is coming soon
https://devdocs.io/javascript/global_objects/intl/durationformat
https://github.com/tc39/proposal-intl-duration-format
*/