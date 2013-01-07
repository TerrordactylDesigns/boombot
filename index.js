/**/// Public: loadBot
/**///
/**/// Args
/**/// config - parsed config
/**///
/**/// Returns
/**/// bot    - a freshly built shiny new robot
/**///
/**/// Notes
/**/// note   - Duct tapes together a boombot
exports.loadBot = function(config) {
  var robot = require('./lib/robot')
  bot       = robot.launch(config.botinfo.auth, config.botinfo.userid, config.roomid)
  return bot
}
/**/// Public: run
/**///
/**/// Args
/**/// bot        - boombot instance
/**/// events     - event handlers
/**/// commands   - array of bot commands
/**/// config     - parsed config.json
/**/// blacklist  - array of blacklist objects
/**/// version    - bot version
/**///
/**/// Returns
/**/// return     - a fully operational battle station
/**///
/**/// Notes
/**/// note       - tells the robot to listen and respond
exports.run = function(bot, events, commands, config, blacklist, version) {
  var robot = require('./lib/robot')
  return robot.run(bot, events, commands, config, blacklist, version)
}
