/**/// Public: Robot class with all variables
/**///
/**/// Args
/**/// boombot - a ttapi bot instance
/**/// events - event router file
/**/// commands - array of commands
/**/// config - parsed config.json object
/**///
/**/// Returns
/**/// return - a robot linked to events, config, commands, and has
/**///          variables set to defaults
var Robot = function(boombot, events, commands, config, version) {
  this.bot = boombot;
  this.config = config;
  this.events = events;
  this.commands = commands;
  this.modCommands = require('../lib/core/admin_controls');
  this.theUsersList = {};
  this.shutUp = false;
  this.snagCounter = 0;
  this.DJMode = false;
  this.djQueue = [];
  this.queue = false;
  this.yank = false;
  this.queueLength = 3;
  this.autoNod = false;
  this.nextUp = {};
  this.blackList = [];
  this.version = version;
};
/**/// Public: Remove a user from the Dj Queue
/**///
/**/// Args
/**/// userID - the userID of the Dj to remove
/**/// userName - the name of the Dj to remove
/**///
/**/// Returns
/**/// return - speech event of confirmation
Robot.prototype.RemoveFromQueue = function(userID, userName) {
  var DJIndex = this.djQueue.indexOf(userID);
  if (DJIndex != -1) {
    this.djQueue.splice(DJIndex, 1);
    this.bot.speak('fine ' + userName + " don't join our party....");
  } else {
    this.bot.speak("You're not in the queue.... type q+ to add yourself.");
  }
};
/**/// Public: Run the queue
/**///
/**/// Args
/**/// currDjs - array of current Djs on stage
/**///
/**/// Returns
/**/// return - Timer controlled announcement and enforcement of Queue
Robot.prototype.runQueue = function(currDjs) {
  if (this.djQueue.length > 0 && currDjs.length < 5) {
    // store the users name and id to stop the recursion insanity i had going on
    this.nextUp = {"name" : this.theUsersList[this.djQueue[0]].name, "id" : this.djQueue[0]};
    this.bot.speak('@' + this.nextUp.name + ' you have 30 seconds starting now to step up');
    var thisBot = this;
    setTimeout(function(){
      // after 30 seconds if that user isnt on stage drop them from queue, hear the lamentation of their women, and run again.
      if (thisBot.djQueue.length > 0 && thisBot.djQueue[0] == thisBot.nextUp.id) {
        thisBot.djQueue.splice(0,1);
        thisBot.runQueue(currDjs);
      }
    }, 30000);
  }
};

module.exports = Robot;