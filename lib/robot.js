/**/// Public: launches a bot into a room
/**///
/**/// Args
/**/// auth - bots auth code
/**/// uid - bots user id
/**/// room - room id for the bot to go to
/**///
/**/// Returns
/**/// return - an instance of a bot
exports.launch = function(auth, uid, room) {
  var ttapi = require('ttapi');
  return new ttapi(auth, uid, room);
};
/**/// Public: the main bot and routing of events
/**///
/**/// Args
/**/// boombot - the instance of the bot
/**/// events - event handlers
/**/// commands - array of loaded bot scripts
/**/// config - parsed config.json
/**///
/**/// Returns
/**/// return - a lean, mean, robot machine
exports.run = function(boombot, events, commands, config, blacklist, version) {
  var Robot = require('../models/robot');
  var robot = new Robot(boombot, events, commands, config, blacklist, version);

  /*<><><><><><><><><><><><><><><><><><><>
            API EMITTED EVENTS
  <><><><><><><><><><><><><><><><><><><>*/
  boombot.on('roomChanged', function(data){ events.roomChangedEvent(robot, data); });
  boombot.on('registered', function(data){ events.registeredEvent(robot, data); });
  boombot.on('deregistered', function(data){ events.deregisteredEvent(robot, data); });
  boombot.on('update_votes', function(data){ events.update_votesEvent(robot, data); });
  boombot.on('newsong', function(data){ events.newsongEvent(robot, data); });
  boombot.on('endsong', function(data){ events.endsongEvent(robot, data); });
  boombot.on('snagged', function(data){ events.snaggedEvent(robot, data); });
  boombot.on('update_user', function(data){ events.update_userEvent(robot, data); });
  boombot.on('booted_user', function(data){ events.booted_userEvent(robot, data); });
  boombot.on('add_dj', function(data){ events.add_djEvent(robot, data); });
  boombot.on('rem_dj', function(data){ events.rem_djEvent(robot, data); });
  boombot.on('pmmed', function(data){ events.pmmedEvent(robot, data); });
  boombot.on('speak', function(data){ events.speakEvent(robot, data); });
};