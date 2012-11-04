/**/// Public: duct tapes together a boom bot
/**///
/**/// Args
/**/// config - parsed config
/**/// events - event router
/**///
/**/// Returns
/**/// bot    - a freshly built shiny new robot
exports.loadBot = function(config) {
  var robot = require('./lib/robot')
  bot       = robot.launch(config.botinfo.auth, config.botinfo.userid, config.roomid)
  return bot
}
/**/// Public: tells the robot to listen and respond
/**///
/**/// Args
/**/// bot      - boombot instance
/**/// events   - event handlers
/**/// commands - array of bot commands
/**/// config   - parsed config.json
/**///
/**/// Returns
/**/// return   - a fully operational battle station
exports.run = function(bot, events, commands, config, blacklist, version) {
  var robot = require('./lib/robot')
  return robot.run(bot, events, commands, config, blacklist, version)
}