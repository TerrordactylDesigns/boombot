/**/// Public: Queue controls
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
module.exports = [
  {
    'trigger': 'q+',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          var userID = uid;
          //  figure out if user is a current DJ or even in the room
          var currDjs = [];
          var roomMembers = [];
          boombot.bot.roomInfo(true, function (data2) {
            roomMembers = data2.users;
            currDjs = data2.room.metadata.djs;
            if (currDjs.contains(userID)) {
              boombot.respond(uid, "Didn't notice you're on stage already?", private);
            } else if (!(roomMembers.contains(userID))) {
              boombot.respond(uid, 'You can\'t join the queue if you\'re not in the room!', private);
            } else if (boombot.djQueue.contains(userID)) {
              boombot.respond(uid, "You're already in the queue. Stop being greedy.....", private);
            } else {
              boombot.djQueue.push(userID);
              var DJIndex = boombot.djQueue.indexOf(userID) + 1;
              boombot.respond(uid, uname + ' has been added in position ' + DJIndex, private);
            }
          });
        } else {
          boombot.respond(uid, 'free for all, hop up!', private);
        }
      }
    }
  },
  {
    'trigger': 'addme',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          var userID = uid;
          //  figure out if user is a current DJ
          var currDjs = [];
          var roomMembers = [];
          boombot.bot.roomInfo(true, function (data2) {
            roomMembers = data2.users;
            currDjs = data2.room.metadata.djs;
            if (currDjs.contains(userID)) {
              boombot.respond(uid, "Didn't notice you're on stage already?", private);
            } else if (!(roomMembers.contains(userID))) {
              boombot.respond(uid, 'You can\'t join the queue if you\'re not in the room!', private);
            } else if (boombot.djQueue.contains(userID)) {
              boombot.respond(uid, "You're already in the queue. Stop being greedy.....", private);
            } else {
              boombot.djQueue.push(userID);
              var DJIndex = boombot.djQueue.indexOf(userID) + 1;
              boombot.respond(uid, uname + ' has been added in position ' + DJIndex, private);
            }
          });
        } else {
          boombot.respond(uid, 'free for all, hop up!', private);
        }
      }
    }
  },
  {
    'trigger': 'q-',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        boombot.RemoveFromQueue(uid, uname);
      }
    }
  },
  {
    'trigger': '/q',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          boombot.respond(uid, "Queue is on. Song limit is:"+boombot.queueLength+". q+ to join. q- to leave. q to see the current wait. /plays for dj played counts", private);
        } else {
          boombot.respond(uid, "Queue is currently off", private);
        }
      }
    }
  },
  {
    'trigger': '/settings',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        var onOff = (boombot.queue) ? "On" : "Off";
        boombot.respond(uid, "Queue is " + onOff + ". Limit: " + boombot.queueLength + " songs.", private);
      }
    }
  },
  {
    'trigger': '/plays',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        boombot.bot.roomInfo(true, function (inf) {
          var currDjArray = inf.room.metadata.djs;
          var counter = currDjArray.length;
          var responseString = "";
          for (i = 0; i < counter; i++) {
            responseString += boombot.theUsersList[currDjArray[i]].name + " (" + boombot.theUsersList[currDjArray[i]].plays + "), ";
          }
          boombot.respond(uid, responseString, private);
        });
      }
    }
  }
];