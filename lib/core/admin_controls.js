/**/// Public: admin_controls
/**///
/**/// Returns
/**/// trigger  - the command trigger
/**/// script   - function to run when triggered. REQUIRES an instance of a bot as the arg.
/**///
/**/// Notes
/**/// note     - array of commands for room admins/moderators
module.exports = [
  {
    trigger: '/q on',
    script: function(boombot, text, uname, uid, private) {
      boombot.queue = true
      boombot.respond(uid, boombot.config.responses.qon, private)
    }
  },
  {
    trigger: '/q off',
    script: function(boombot, text, uname, uid, private) {
      boombot.queue = false
      boombot.djQueue = []
      boombot.respond(uid, boombot.config.responses.qoff, private)
    }
  },
  {
    trigger: '/1',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 1
      boombot.respond(uid, boombot.config.responses.onesong, private)
    }
  },
  {
    trigger: '/2',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 2
      boombot.respond(uid, boombot.config.responses.twosongs, private)
    }
  },
  {
    trigger: '/3',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 3
      boombot.respond(uid, boombot.config.responses.threesongs, private)
    }
  },
  {
    trigger: '/none',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 100
      boombot.respond(uid, boombot.config.responses.nolimit, private)
    }
  },
  {
    trigger: '/notheme',
    script: function(boombot, text, uname, uid, private) {
      boombot.theme = null
	  boombot.respond(uid, boombot.config.responses.notheme, private)
    }
  },
  {
    trigger: 'settheme',
    script: function(boombot, text, uname, uid, private) {
      boombot.theme = text.substring(9)
	  boombot.respond(uid, 'Set theme to: '+boombot.theme+'.', private)
    }
  },
  {
    trigger: 'vip',
    script: function(boombot, text, uname, uid, private) {
      var nameArray = text.split('vip ')
        , name      = nameArray[1]
      boombot.bot.roomInfo(function(data) {
        var djArray = data.room.metadata.djs
        for (user in boombot.theUsersList) {
          if (boombot.theUsersList[user].name === name && djArray.indexOf(boombot.theUsersList[user].userid) === -1) {
            var DJIndex = boombot.djQueue.indexOf(boombot.theUsersList[user].userid)
            if (DJIndex != -1) {
              boombot.djQueue.splice(DJIndex, 1)
            }
            boombot.djQueue.unshift(boombot.theUsersList[user].userid)
            boombot.respond(uid, boombot.config.responses.vip.replace('XXXX', boombot.theUsersList[user].name), private)
          }
        }
      })
    }
  }
]
