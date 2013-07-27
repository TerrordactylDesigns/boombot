/*
  Variables
*/
var deregisteredData  = require('./fixtures/deregisteredData')
  , endsongData       = require('./fixtures/endsongData')
  , events            = require('../lib/events')
  , newsongData       = require('./fixtures/newsongData')
  , registeredData    = require('./fixtures/registeredData')
  , roomChangedData   = require('./fixtures/roomChangedData')
  , snaggedData       = null
/*
  TESTS
*/
module.exports = function(test, blankBoombot) {
/*
  roomChangedEvent tests
*/
// verify theUsersList is reset
test('test userList reset', function(t){
  var boombot = new blankBoombot()
  boombot.theUsersList['test'] = { name:'unittest', userid:'a1234' }
  events.roomChangedEvent(boombot, roomChangedData)
  t.notOk(boombot.theUsersList['test'], 'Users list is successfully reset on roomChange')
  t.end()
})
// verify theUsersList is filled
test('test that the theUsersList is filled on roomChange', function(t) {
  var boombot = new blankBoombot()
  events.roomChangedEvent(boombot, roomChangedData)
  t.ok(boombot.theUsersList['4f4ce636a3f7512f70000fef'], 'theUsersList is successfully filled on roomChange')
  t.end()
})
/*
  registeredEvent tests
*/
// verify the user is added to theUsersList
test('test that the user is added to theUsersList', function(t) {
  var boombot = new blankBoombot()
  events.registeredEvent(boombot, registeredData)
  t.ok(boombot.theUsersList[registeredData.user[0].userid], 'User was successfully added to theUsersList on room entry')
  t.end()
})
// verify banned users are booted
test('test that a blacklisted user is booted on registeredEvent', function(t) {
  var actual  = null
    , boombot = new blankBoombot()
  boombot.bot = {
    bootUser : function(userid, message) {
      actual = userid
    }
  }
  boombot.blackList = [{user: {userid: '4f569e32a3f751581a009f39'}}]
  events.registeredEvent(boombot, registeredData)
  t.equal(actual, '4f569e32a3f751581a009f39', 'the blacklisted user was booted on registeredEvent')
  t.end()
})
// TODO - tests for announcers
/*
  deregisteredEvent tests
*/
// verify the user is removed from theUsersList
test('test that the user is removed from theUsersList', function(t) {
  var boombot = new blankBoombot()
  events.deregisteredEvent(boombot, deregisteredData)
  t.notOk(boombot.theUsersList[deregisteredData.user[0].userid], 'User was successfully removed from theUsersList on leaving room')
  t.end()
})
// tests for queue removal
test('test that the user is removed from the queue on deregisteredEvent', function(t) {
  var actual  = null
    , boombot = new blankBoombot()
  boombot.djQueue = ['1234', '4321', '50073697eb35c17ea7000039']
  boombot.RemoveFromQueue = function(id, name) {
    actual = id
  }
  events.deregisteredEvent(boombot, deregisteredData)
  t.equal(actual, '50073697eb35c17ea7000039', 'User was successfully removed from the queue on deregisteredEvent')
  t.end()
})
// TODO - update_votes tests
/*
  newsongEvent tests
*/
// verify the snagCounter is reset
test('test newsongEvent resets the snagCounter', function(t) {
  var boombot = new blankBoombot()
  boombot.snagCounter = 2
  boombot.theUsersList[newsongData.room.metadata.current_dj] = {name: 'test', IncPlays: function(){}}
  boombot.bot = {
    getFans: function(a,b) {
      return 0
    }
  }
  events.newsongEvent(boombot, newsongData)
  t.notOk(boombot.snagCounter == 2, 'The snagCounter was successfully reset on newsong')
  t.equal(0, boombot.snagCounter, 'The snagCounter was successfully reset on newsong')
  t.end()
})
// verify the current Djs play count increments
test('test that the current Dj\'s play count increments on newsongEvent', function(t) {
  var boombot = new blankBoombot()
    , testDj  = require('../models/dj')
  boombot.theUsersList['4f4ce636a3f7512f70000fef'] = new testDj('@GodOfThisAge', '4f4ce636a3f7512f70000fef')
  boombot.bot = {
    getFans: function(a,b) {
      return 0
    }
  }
  events.newsongEvent(boombot, newsongData)
  t.equal(boombot.theUsersList['4f4ce636a3f7512f70000fef'].plays, 1, 'current Dj play count is incremented on newsongEvent')
  t.end()
})
// TODO - test for queue control, autoNod
/*
  snaggedEvent tests
*/
// verify the snagCounter increments
test('test snaggedEvent increments snagCounter', function(t) {
  var boombot = new blankBoombot()
  events.snaggedEvent(boombot, snaggedData)
  t.notOk(boombot.snagCounter == 0, 'The snagCounter did not remain 0 on snag event')
  t.equal(1, boombot.snagCounter, 'The snagCounter was incremented on snag event')
  t.end()
})
/*
  endsongEvent tests
*/
// verify stats are spoken
test('test that the after song stats are parsed and spoken on endsongEvent', function(t) {
  var actual  = null
    , boombot = new blankBoombot()
    , testDj  = require('../models/dj')
  boombot.theUsersList['4f4ce636a3f7512f70000fef'] = new testDj('@GodOfThisAge', '4f4ce636a3f7512f70000fef')
  boombot.bot = {
    speak: function(text) {
      actual = text
    },
    getFans: function(a,b) {
      return boombot.bot.speak(endsongData.room.metadata.current_song.metadata.song + " by " + endsongData.room.metadata.current_song.metadata.artist + " got :+1: " + endsongData.room.metadata.upvotes + " :-1: " +  endsongData.room.metadata.downvotes + " <3 " + boombot.snagCounter + " :star: " + (0 - boombot.theUsersList['4f4ce636a3f7512f70000fef'].startFans))
    }
  }
  boombot.config['stats'] = true
  boombot.shutUp = false
  boombot.snagCounter = 3
  events.endsongEvent(boombot, endsongData)
  t.equal(actual, "Poker Face by Lady GaGa got :+1: 0 :-1: 0 <3 3 :star: 0", 'The vote log is parsed and spoke on endsongEvent')
  t.end()
})
// test for queue removals if valid
test('test that the Dj is removed if their play count is higher than the q max', function(t) {
  var actual  = false
    , boombot = new blankBoombot()
    , testDj  = require('../models/dj')
  boombot.bot = {
    remDj : function(x) {
      actual = true
    }
  }
  boombot.queue = true
  boombot.queueLength = 1
  boombot.theUsersList['4deadb0f4fe7d013dc0555f1'] = new testDj('@GodOfThisAge', '4f4ce636a3f7512f70000fef')
  boombot.theUsersList['4deadb0f4fe7d013dc0555f1'].plays = 2
  events.endsongEvent(boombot, endsongData)
  t.equal(actual, true, 'User is removed from the stage if play count is higher than the q max')
  t.end()
})
// test to make sure you are not removed if the q limit is not met
test('test that the Dj is not removed if their play count is less than the q max', function(t) {
  var actual  = false
    , boombot = new blankBoombot()
    , testDj  = require('../models/dj')
  boombot.bot = {
    remDj : function(x) {
      actual = true
    }
  }
  boombot.queue       = true
  boombot.queueLength = 3
  boombot.theUsersList['4deadb0f4fe7d013dc0555f1'] = new testDj('@GodOfThisAge', '4f4ce636a3f7512f70000fef')
  boombot.theUsersList['4deadb0f4fe7d013dc0555f1'].plays = 2
  events.endsongEvent(boombot, endsongData)
  t.equal(actual, false, 'User is left on stage if the play count is less than the q max')
  t.end()
})
// TODO - tests for add_djEvent
// TODO - tests for rem_djEvent
// TODO - tests for handleCommand
}