/*!
 * express-csv
 * Copyright 2011 Seiya Konno <nulltask@gmail.com>
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

module.exports = function(express) {
  var http = require('http')
    , res = express.response || http.ServerResponse.prototype
    , toExport = {};

  /**
   * Import package information.
   */

  var package = require('../package');

  /**
   * Library version.
   */

  toExport.version = package.version;

  /**
   * CSV separator
   */

  toExport.separator = ',';

  /**
   * Prevent Excel's casting.
   */

  toExport.preventCast = false;

  /**
   * Ignore `null` or `undefined`
   */

  toExport.ignoreNullOrUndefined = true;

  /**
   * Escape CSV field
   *
   * @param {Mixed} field
   * @return {String}
   * @api private
   */

  function escape(field) {
    if (toExport.ignoreNullOrUndefined && field == undefined) {
      return '';
    }
    if (toExport.preventCast) {
      return '="' + String(field).replace(/\"/g, '""') + '"';
    }
    return '"' + String(field).replace(/\"/g, '""') + '"';
  }

  /**
   * Convert an object to an array of property values.
   *
   * Example:
   *    objToArray({ name: "john", id: 1 })
   *    // => [ "john", 1 ]
   *
   * @param {Object} obj The object to convert.
   * @return {Array} The array of object properties.
   * @api private
   */

  function objToArray(obj) {
    var result = [];
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        result.push(obj[prop]);
      }
    }
    return result;
  }

  /**
   * Send CSV response with `obj`, optional `headers`, and optional `status`.
   *
   * @param {Array} obj
   * @param {Object|Number} headers or status
   * @param {Number} status
   * @return {ServerResponse}
   * @api public
   */

  res.csv = function(obj, headers, status) {
    var body = '';

    this.charset = this.charset || 'utf-8';
    this.header('Content-Type', 'text/csv');

    obj.forEach(function(item) {
      if (!(item instanceof Array)) item = objToArray(item);
      body += item.map(escape).join(toExport.separator) + '\r\n';
    });

    return this.send(body, headers, status);
  };

  return toExport;
};
