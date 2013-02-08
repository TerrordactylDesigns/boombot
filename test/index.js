/*
  Variables
*/
var test = require('tap').test
  , blankBoombot = function() {
      this.autoNod          = false
      this.blackList        = []
      this.bot              = {}
      this.config           = {consolelog: false, responses:{ blackisted: 'you were blacklisted'}, twitter:{tweet: false}, lastfm:{use:false, scrobble:false}}
      this.DJMode           = false
      this.djQueue          = []
      this.nextUp           = {}
      this.queue            = false
      this.queueLength      = 3
      this.RemoveFromQueue  = null
      this.shutUp           = true
      this.snagCounter      = 0
      this.theUsersList     = {}
      this.yank             = false
    }
/*
  TESTS
*/
var eventstests = require('./eventstests')(test, blankBoombot)
  , loadtests   = require('./loadtests')(test, blankBoombot)
  , modelstests = require('./modelstests')(test, blankBoombot)