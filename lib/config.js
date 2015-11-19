/*
 * clamd-config.js: Config for the chowder server similar to what clamd would be configured with
 *
 * (C) 2015 Nick Palmer
 * BSD-3-Clause LICENCE
 */

var clamdConfig = {};

clamdConfig.port = 3310;
clamdConfig.streamPortRange = [58600, 58601];

module.exports = clamdConfig;
