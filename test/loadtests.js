/*
  TESTS
*/
module.exports = function(test, blankBoombot) {
  // verify we can parse a copy of the example.config.json file
  test('test loading configuration file', function(t){
    var config = require('../lib/load').ParseConfig('V2.0.0' ,'./fixtures/testconfig.js')
    t.equal("boombot", config.botinfo.botname, "JSON was parsed successfully")
    t.end()
  })
  // verify we can load the empty blacklist
  test('test that the initial empty blacklist loads', function(t) {
    var blacklist = require('../lib/load').LoadBlacklist('./fixtures/emptyblacklist.js')
    t.type(blacklist, "Object", 'Empty blacklist was loaded successfully.')
    t.end()
  })
  // verify we can load a blacklist with members
  test('test that a filled blacklist loads', function(t) {
    var blacklist = require('../lib/load').LoadBlacklist('./fixtures/filledblacklist.js')
    t.equal('@GodOfThisAge', blacklist.user.name, 'Filled blacklist was successfully loaded')
    t.end()
  })
  // test that core scripts load
  test('test that the core scripts load', function(t) {
    var commands  = []
      , scripts   = require('../lib/load').LoadCore(commands, '../test/fixtures/controls.js')
    t.equal('/boombot', scripts[0].trigger, 'Core scripts were parsed')
    t.end()
  })
  // test that queue scripts load
  test('test that the queue scripts load', function(t) {
    var commands  = []
      , scripts   = require('../lib/load').LoadCore(commands, '../test/fixtures/controls.js')
    t.equal('/boombot', scripts[0].trigger, 'Queue scripts were parsed')
    t.end()
  })
  // // test that optional script loads
  // test('test that the optional script loads', function(t) {

  //   t.end()
  // })
  // // test that a bad optional script does not load
  // test('test that the bad optional script does not load', function(t) {

  //   t.end()
  // })
}