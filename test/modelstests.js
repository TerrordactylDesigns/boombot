/*
  TESTS
*/
module.exports = function(test, blankBoombot) {
/*
  DJ
*/
// test clearplays prototype
test('test that the ClearPlays prototype functions', function(t) {
  var DJ = require('../models/dj')
    , dj = new DJ('@GodOfThisAge', '1234')
  t.ok(dj.plays == 0, 'New DJ object starts with 0 plays')
  dj.plays += 1
  t.ok(dj.plays == 1, 'Plays incremented manually')
  dj.ClearPlays()
  t.equal(0, dj.plays, 'ClearPlays reset the DJs plays to 0')
  t.end()
})
// test IncPlays prototype
test('test that the IncPlays prototype functions', function(t) {
  var DJ = require('../models/dj')
    , dj = new DJ('@GodOfThisAge', '1234')
  t.ok(dj.plays == 0, 'New DJ object starts with 0 plays')
  dj.IncPlays()
  t.equal(1, dj.plays, 'IncPlays incremented the DJs plays')
  t.end()
})
/*
  Robot
*/
}