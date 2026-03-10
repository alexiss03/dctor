const util = require('util');

if (typeof util.isRegExp !== 'function') {
  util.isRegExp = value => value instanceof RegExp;
}

if (typeof util.isDate !== 'function') {
  util.isDate = value => value instanceof Date;
}

if (typeof util.isError !== 'function') {
  util.isError = value => value instanceof Error;
}
