/*
 * virus-scanner.js: Object to handle scanning of data/files
 *
 * (C) 2015 Nick Palmer
 * BSD-3-Clause LICENCE
 */

var virusScanner = {};

virusScanner.scan = function(data) {
  // TODO - better eicar testing
  if (data.toString('ascii', 0, 10) === 'X5O!P%@AP[') {
    return 'Eicar-Test-Signature FOUND';
  }
  
  return 'OK';
  // TODO - Add option to pass on to alt local AV
  // TODO - Add option to prompt user for response on console?
};

module.exports = virusScanner;
