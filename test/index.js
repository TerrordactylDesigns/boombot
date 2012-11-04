/*
  Variables
*/
var test = require('tap').test
  , blankBoombot = function() {
      this.autoNod = false
      this.blackList = []
      this.bot = {}
      this.config = {consolelog: false, responses:{ blackisted: 'you were blacklisted'}}
      this.DJMode = false
      this.djQueue = []
      this.nextUp = {}
      this.queue = false
      this.queueLength = 3
      this.RemoveFromQueue = null
      this.shutUp = true
      this.snagCounter = 0
      this.theUsersList = {}
      this.yank = false
    }
// im lazy
Array.prototype.contains = function(obj) {
  var i = this.length
  while (i--)
    if (this[i] == obj)
      return true
  return false
}
/*
  TESTS
*/
var boombottests = require('./boombottests')(test, blankBoombot)
  , eventstests = require('./eventstests')(test, blankBoombot)
  , modelstests = require('./modelstests')(test, blankBoombot)