/**/// Public: Queue controls
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
module.exports = [
  {
    'trigger': 'q+',
    'listed': false,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          var userID = data.userid;
          //  figure out if user is a current DJ
          var currDjs = [];
          boombot.bot.roomInfo(true, function (data2) {
            currDjs = data2.room.metadata.djs;
            if (currDjs.contains(userID)) {
              boombot.bot.speak("Didn't notice you're on stage already?");
            } else if (boombot.djQueue.contains(userID)) {
              boombot.bot.speak("You're already in the queue. Stop being greedy.....");
            } else {
              boombot.djQueue.push(userID);
              var DJIndex = boombot.djQueue.indexOf(userID) + 1;
              boombot.bot.speak(data.name + ' has been added in position ' + DJIndex);
            }
          });
        } else {
          boombot.bot.speak('free for all, hop up!');
        }
      }
    }
  },
  {
    'trigger': 'addme',
    'listed': false,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          var userID = data.userid;
          //  figure out if user is a current DJ
          var currDjs = [];
          boombot.bot.roomInfo(true, function (data2) {
            currDjs = data2.room.metadata.djs;
            if (currDjs.contains(userID)) {
              boombot.bot.speak("Didn't notice you're on stage already?");
            } else if (boombot.djQueue.contains(userID)) {
              boombot.bot.speak("You're already in the queue. Stop being greedy.....");
            } else {
              boombot.djQueue.push(userID);
              var DJIndex = boombot.djQueue.indexOf(userID) + 1;
              boombot.bot.speak(data.name + ' has been added in position ' + DJIndex);
            }
          });
        } else {
          boombot.bot.speak('free for all, hop up!');
        }
      }
    }
  },
  {
    'trigger': 'q-',
    'listed': false,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        boombot.RemoveFromQueue(data.userid, data.name);
      }
    }
  },
  {
    'trigger': '/q',
    'listed': true,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          boombot.bot.speak("Queue is on. Song limit is:"+boombot.queueLength+". q+ to join. q- to leave. q to see the current wait. /plays for dj played counts");
        } else {
          boombot.bot.speak("Queue is currently off");
        }
      }
    }
  },
  {
    'trigger': '/settings',
    'listed': false,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        var onOff = (boombot.queue) ? "On" : "Off";
        boombot.bot.speak("Queue is " + onOff + ". Limit: " + boombot.queueLength + " songs.");
      }
    }
  },
  {
    'trigger': '/plays',
    'listed': false,
    'script': function(boombot, data) {
      if (boombot.config.queue) {
        boombot.bot.roomInfo(true, function (inf) {
          var currDjArray = inf.room.metadata.djs;
          var counter = currDjArray.length;
          var responseString = "";
          for (i = 0; i < counter; i++) {
            responseString += boombot.theUsersList[currDjArray[i]].name + " (" + boombot.theUsersList[currDjArray[i]].plays + "), ";
          }
          boombot.bot.speak(responseString);
        });
      }
    }
  }
];