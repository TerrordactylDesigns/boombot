/*
  Variables
*/
var test = require('tap').test;
// var robot = require('../lib/robot');
var events = require('../lib/events');
// im lazy
Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] == obj) {
            return true;
        }
    }
    return false;
}
var blankBoombot = function() {
    this.config = {consolelog: false};
    this.theUsersList = {};
    this.shutUp = true;
    this.snagCounter = 0;
    this.DJMode = false;
    this.djQueue = [];
    this.queue = false;
    this.yank = false;
    this.queueLength = 3;
    this.autoNod = false;
    this.nextUp = {};
    this.blackList = [];
}
/*
  TESTS
*/
//verify we can parse a copy of the example.config.json file
//test('test loading configuration file', function(t){
  // var config = require('../bin/boombot').LoadConfig('./fixtures/testconfig.json');
  // t.equal("boombot", config.botinfo.botname, "JSON was parsed successfully");
  // t.end();
//})
/*
  EVENTS.JS TESTS
*/
// roomChangedEvent tests
var roomChangedData = require('./fixtures/roomChangedData');
// verify theUsersList is reset
test('test userList reset', function(t){
  var boombot = new blankBoombot();
  boombot.theUsersList['test'] = { name:'unittest', userid:'a1234' };
  events.roomChangedEvent(boombot, roomChangedData);
  t.notOk(boombot.theUsersList['test'], 'Users list is successfully reset on roomChange');
  t.end();
})
// verify theUsersList is filled
test('test that the theUsersList is filled on roomChange', function(t) {
  var boombot = new blankBoombot();
  events.roomChangedEvent(boombot, roomChangedData);
  t.ok(boombot.theUsersList['4f4ce636a3f7512f70000fef'], 'theUsersList is successfully filled on roomChange');
  t.end();
})
// registeredEvent tests
var registeredData = require('./fixtures/registeredData');
// verify the user is added to theUsersList
test('test that the user is added to theUsersList', function(t) {
  var boombot = new blankBoombot();
  events.registeredEvent(boombot, registeredData);
  t.ok(boombot.theUsersList[registeredData.user[0].userid], 'User was successfully added to theUsersList on room entry');
  t.end();
})
// TODO - tests for announcers
// deregisteredEvent tests
var deregisteredData = require('./fixtures/deregisteredData');
// verify the user is removed from theUsersList
test('test that the user is removed from theUsersList', function(t) {
  var boombot = new blankBoombot();
  events.deregisteredEvent(boombot, registeredData);
  t.notOk(boombot.theUsersList[deregisteredData.user[0].userid], 'User was successfully removed from theUsersList on leaving room');
  t.end();
})
// TODO - tests for queue removal
// TODO - update_votes tests
// newsongEvent tests
var newsongData = require('./fixtures/newsongData');
// verify the snagCounter is reset
test('test that the snagCounter is reset', function(t) {
  var boombot = new blankBoombot();
  boombot.snagCounter = 2;
  boombot.theUsersList[newsongData.room.metadata.current_dj] = {name: 'test', IncPlays: function(){}};
  events.newsongEvent(boombot, newsongData);
  t.notOk(boombot.snagCounter == 2, 'The snagCounter was successfully reset on newsong');
  t.equal(0, boombot.snagCounter, 'The snagCounter was successfully reset on newsong');
  t.end();
})
// TODO - test for queue control, autoNod
// TODO - endsongEvent tests
//var endsongData = require('./fixtures/endsongData');
// snaggedEvent tests
var snaggedData = null;
// verify the snagCounter increments
test('test that the snagCounter increments', function(t) {
  var boombot = new blankBoombot();
  events.snaggedEvent(boombot, snaggedData);
  t.notOk(boombot.snagCounter == 0, 'The snagCounter did not remain 0 on snag event');
  t.equal(1, boombot.snagCounter, 'The snagCounter was incremented on snag event');
  t.end();
})