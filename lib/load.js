var fs = require('fs')
/**/// Public: Parses config.json settings
/**///
/**/// Args
/**/// filepath       - optional filepath value for testing
/**///
/**/// Returns
/**/// configuration  - return parsed JSON object
exports.ParseConfig = function(version, filepath) {
  try {
    console.log('*******Loading Configuration*******')
    filepath  = (filepath === undefined) ? 'config.json' : filepath
    config    = JSON.parse(fs.readFileSync(filepath, 'ascii'))
    console.log('*******Configuration Loaded********')
    console.log('***********************************')
    console.log('**********BOOMBOT '+version+'***********')
    console.log('***********************************')
    console.log('*******Initializing Systems********')
    return config
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading config.json. Check that your config file exists and is valid JSON.')
    process.exit(33)
  }
}
/**/// Public: loads the blacklist store
/**///
/**/// Args
/**/// filepath  - optional filepath value for testing
/**///
/**/// Returns
/**/// blacklist - parsed blacklist object
exports.LoadBlacklist = function(filepath) {
  try {
    console.log('*********Loading blacklist*********')
    filepath  = (filepath === undefined) ? './models/store/blacklist.json' : filepath
    blacklist = JSON.parse(fs.readFileSync(filepath, 'ascii'))
    console.log('*********Blacklist Loaded**********')
    console.log(blacklist)
    return blacklist
  } catch(err) {
    // Create blacklist if it doesn't exist
    // This failure catch method allows upgrades without overwriting the blacklist
    try {
      console.log('********Creating blacklist*********')
      blacklist = {};
      fs.writeFileSync('./models/store/blacklist.json', JSON.stringify(blacklist), 'ascii')
      console.log('*********Blacklist Loaded**********')
      return blacklist
    } catch (err) {
      console.log(err)
      console.log('[ ERROR ] : Error creating blacklist.json. Please check file system permissions.')
      process.exit(33)
    }
  }
}
/**/// Private: loads core scripts from lib/core
/**///
/**/// Args
/**/// commands   - array of commands
/**/// filepath   - optional filepath value for testing
/**///
/**/// Returns
/**/// return     - for each command in the base_controls array we will build the commands array
exports.LoadCore = function(commands, filepath) {
  console.log('*******Loading Core Scripts********')
  filepath = (filepath === undefined) ? '../lib/core/base_controls' : filepath
  var base_controls = require(filepath)
  for (i = 0; i < base_controls.length; i++) {
    console.log('Loading: ' + base_controls[i].trigger)
    commands.push(base_controls[i])
  }
  return commands
}
/**/// Private: loads queue scripts from lib/core
/**///
/**/// Args
/**/// commands   - array of commands
/**/// filepath   - optional filepath value for testing
/**///
/**/// Returns
/**/// return     - for each command in the queue_controls array we will build the commands array
exports.LoadQueue = function(commands, filepath) {
  console.log('*******Loading Queue Scripts********')
  filepath = (filepath === undefined) ? '../lib/core/queue_controls' : filepath
  var queue_controls = require(filepath)
  for (i = 0; i < queue_controls.length; i++) {
    console.log('Loading: ' + queue_controls[i].trigger)
    commands.push(queue_controls[i])
  }
  return commands
}
/**/// Private: loads scripts from optional scripts folder
/**///
/**/// Args
/**/// commands   - array of commands
/**/// filepath   - optional filepath value for testing
/**///
/**/// Returns
/**/// return     - for each file in the scripts folder we will build the commands array
exports.LoadOptional = function(commands, filepath) {
  try {
    var filenames = fs.readdirSync('./scripts')
    console.log('*****Loading Optional Scripts******')
    for (i = 0; i < filenames.length; i++) {
      if (filenames[i] != '.DS_Store') {
        console.log('Loading: ' + filenames[i])
        var command = require('../scripts/' + filenames[i])
        commands.push({'trigger': command.trigger, 'listed': command.listed, 'script': command.script})
      }
    }
  } catch(err) {
    console.log(err)
    console.log('[ ERROR ] : Error loading script(s). Please fix or remove the failed script(s) shown above')
  }
  return commands
}