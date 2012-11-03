/**/// Public: array of commands for room admins/moderators
/**///
/**/// Returns
/**/// trigger - the command trigger
/**/// script - function to run when triggered. REQUIRES an instance of a bot as the arg.
module.exports = [
  {
    trigger: '/q on',
    script: function(boombot, text, uname, uid, private) {
      boombot.queue = true;
      boombot.respond(uid, boombot.config.responses.qon, private);
    }
  },
  {
    trigger: '/q off',
    script: function(boombot, text, uname, uid, private) {
      boombot.queue = false;
      boombot.djQueue = [];
      boombot.respond(uid, boombot.config.responses.qoff, private);
    }
  },
  {
    trigger: '/1',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 1;
      boombot.respond(uid, boombot.config.responses.onesong, private);
    }
  },
  {
    trigger: '/2',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 2;
      boombot.respond(uid, boombot.config.responses.twosongs, private);
    }
  },
  {
    trigger: '/3',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 3;
      boombot.respond(uid, boombot.config.responses.threesongs, private);
    }
  },
  {
    trigger: '/none',
    script: function(boombot, text, uname, uid, private) {
      boombot.queueLength = 100;
      boombot.respond(uid, boombot.config.responses.nolimit, private);
    }
  }
];