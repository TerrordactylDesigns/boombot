/*
  Variables
*/

/*
  TESTS
*/
module.exports = function(test, blankBoombot) {
  //verify we can parse a copy of the example.config.json file
  test('test loading configuration file', function(t){
    var config = require('../lib/load').ParseConfig('V2.0.0' ,'./fixtures/testconfig.js')
    t.equal("boombot", config.botinfo.botname, "JSON was parsed successfully")
    t.end()
  })
}