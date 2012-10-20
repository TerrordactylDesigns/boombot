/*
  Variables
*/
var test = require('tap').test;
var robot = require('../lib/robot');
//var events = require('../lib/events');
/*
  TESTS
*/
//verify we can parse a copy of the example.config.json file
test('test loading configuration file', function(t){
  var config = require('../bin/boombot').LoadConfig('./fixtures/testconfig.json');
  t.equal("boombot", config.botinfo.botname, "JSON was parsed successfully");
  t.end();
})