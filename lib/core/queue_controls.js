/**/// Public: queue_controls
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
/**///
/**/// Notes
/**/// note   - Queue controls
module.exports = [
  {
    'trigger': 'q+',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        if (boombot.queue) {
          var currDjs = []
            , notHere = true
            , roomMembers = []
            , userID = uid
          //  figure out if user is a current DJ or even in the room
          boombot.bot.roomInfo(true, function (data2) {
            roomMembers = data2.users
            currDjs = data2.room.metadata.djs
            for (i = 0; i < roomMembers.length; i++) {
              if (roomMembers[i].userid == userID) {
                notHere = false
              }
            }
            if (currDjs.contains(userID))
              boombot.respond(uid, boombot.config.responses.onstagealready, private)
            else if (notHere)
              boombot.respond(uid, boombot.config.responses.notinroom, private)
            else if (boombot.djQueue.contains(userID))
              boombot.respond(uid, boombot.config.responses.alreadyinq, private)
            else {
              boombot.djQueue.push(userID)
              var DJIndex = boombot.djQueue.indexOf(userID) + 1
              boombot.respond(uid, uname + ' has been added in position ' + DJIndex, private)
              if (DJIndex == 1 && currDjs.length < 5) {
                boombot.runQueue()
              }
            }
          })
        } else {
          boombot.respond(uid, boombot.config.responses.freeforall, private)
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
          var currDjs = []
            , notHere = true
            , roomMembers = []
            , userID = uid
          //  figure out if user is a current DJ or even in the room
          boombot.bot.roomInfo(true, function (data2) {
            roomMembers = data2.users
            currDjs = data2.room.metadata.djs
            for (i = 0; i < roomMembers.length; i++) {
              if (roomMembers[i].userid == userID) {
                notHere = false
              }
            }
            if (currDjs.contains(userID))
              boombot.respond(uid, boombot.config.responses.onstagealready, private)
            else if (notHere)
              boombot.respond(uid, boombot.config.responses.notinroom, private)
            else if (boombot.djQueue.contains(userID))
              boombot.respond(uid, boombot.config.responses.alreadyinq, private)
            else {
              boombot.djQueue.push(userID)
              var DJIndex = boombot.djQueue.indexOf(userID) + 1
              boombot.respond(uid, uname + ' has been added in position ' + DJIndex, private)
              if (DJIndex == 1 && currDjs.length < 5) {
                boombot.runQueue()
              }
            }
          })
        } else {
          boombot.respond(uid, boombot.config.responses.freeforall, private)
        }
      }
    }
  },
  {
    'trigger': 'q-',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        boombot.RemoveFromQueue(uid, uname, private)
      }
    }
  },
  {
    'trigger': '/q',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        if (boombot.queue)
          boombot.respond(uid, 'Queue is on. Song limit is:'+boombot.queueLength+'. q+ to join. q- to leave. q to see the current wait. /plays for dj played counts', private)
        else
          boombot.respond(uid, "Queue is currently off", private)
      }
    }
  },
  {
    'trigger': '/settings',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        var onOff = (boombot.queue) ? 'On' : 'Off'
        boombot.respond(uid, 'Queue is ' + onOff + '. Limit: ' + boombot.queueLength + ' songs.', private)
      }
    }
  },
  {
    'trigger': '/plays',
    'listed': false,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.queue) {
        boombot.bot.roomInfo(true, function (inf) {
          var currDjArray = inf.room.metadata.djs
          var counter = currDjArray.length
          var responseString = ''
          for (i = 0; i < counter; i++) {
            responseString += boombot.theUsersList[currDjArray[i]].name + ' (' + boombot.theUsersList[currDjArray[i]].plays + '), '
          }
          boombot.respond(uid, responseString, private)
        })
      }
    }
  }
]
