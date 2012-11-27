/**/// Public: Master commands. Now also room moderators if allowed in config file.
/**///
/**/// Args
/**/// boombot - an instance of a boombot
/**/// data - the data from the event handler
/**///
/**/// Returns
/**/// return - runs commands for bot control by the master
exports.script = function(boombot, text, uname, uid, private) {
  //tell the bot to enter silent mode (doesnt announce users or welcome people or respond to commands other than admin commands)
  if (text.match(/shutup/i)) {
    boombot.shutUp = true
    boombot.respond(uid, 'Silent mode activated.', private)
  }
  //let the bot speak again
  if (text.match(/speakup/i)) {
    boombot.shutUp = false
    boombot.respond(uid, 'Chatterbox mode activated.', private)
  }
  //makes the bot get on stage
  if (text.match(/djmode/i)) {
    boombot.DJMode = true
    boombot.bot.addDj()
  }
  //tells the bot to get off stage and get in the crowd
  if (text.match(/getdown/i)) {
    boombot.DJMode = false
    boombot.respond(uid, 'Aural destruction mode de-activated.', private)
    boombot.bot.remDj()
  }
  //tells the bot to skip the track it is playing
  if (text.match(/skip/i)) {
    boombot.respond(uid, 'As you wish master.', private)
    boombot.bot.skip()
  }
  //remind your robot hes a good boy. Just in case the robot apocalypse happens, maybe he will kill you last.
  if (text.match(/good/i)) {
    boombot.respond(uid, 'The masters desires are my commands', private)
  }
  //this section makes the bot upvote a song.
  if (text.match(/dance/i)) {
    boombot.bot.bop()
    boombot.respond(uid, 'I shall dance for the masters amusement.', private)
  }
  // set the bots avatar
  if (text.match(/avatar/i)) {
    var avatarArray = text.split(boombot.config.botinfo.botname + ' avatar ')
      , avatar = avatarArray[1]
      , responses = [ 'Form of ..! What the hell am i?'
        , 'I feel so pretty now!'
        , 'You really want me to dress like this? Creepy.....'
        , 'Hey everyone, come see how handsome I look!'
        ]
      , rndm = Math.floor(Math.random() * 4);
    boombot.bot.setAvatar(avatar);
    boombot.bot.speak(responses[rndm]);
  }
  //tell the bot to go into voodoo doll avatar. What better avatar for your toy?
  if (text.match(/voodoo up/i)) {
    try {
      boombot.bot.setAvatar(10)
      boombot.respond(uid, 'I am the masters toy.', private)
    } catch (err) {
      boombot.respond(uid, 'I do not have that form master.', private)
    }
  }
  //the ladies love a kitten. but really its punishment mode for the robot.
  if (text.match(/kitten up/i)) {
    try {
      boombot.bot.setAvatar(19)
      boombot.respond(uid, 'Did I anger the master?', private)
    } catch (err) {
      boombot.respond(uid, 'I do not have that form master.', private)
    }
  }
  //his dj skillz/dance moves are outta this world
  if (text.match(/alien up/i)) {
    try {
      boombot.bot.setAvatar(12)
      boombot.respond(uid, 'Alien dance form entered.', private)
    } catch (err) {
      boombot.respond(uid, 'I do not have that form master.', private)
    }
  }
  //if he sparkles, this command will be removed
  if (text.match(/vampire up/i)) {
    try {
      boombot.bot.setAvatar(16)
      boombot.respond(uid, 'Like this master? I dont want to be punished for being too Twilight.', private)
    } catch (err) {
      boombot.respond(uid, 'I do not have that form master.', private)
    }
  }
  //adds the current playing song to the bots playlist
  if (text.match(/addsong/i)) {
    boombot.bot.roomInfo(true, function(data2) {
      try {
        var newSong = data2.room.metadata.current_song._id
        var newSongName = songName = data2.room.metadata.current_song.metadata.song
        boombot.bot.snag()
        boombot.bot.playlistAdd(newSong)
        boombot.respond(uid, 'Added '+newSongName+' to the masters amusement list.', private)
      } catch (err) {
        errMsg(err)
      }
    })
  }
  //reorder the bots playlist
  if (text.match(/reorder/i)) {
    boombot.bot.playlistAll(function(playlist) {
      //boombot.bot.speak('Reordering my ' + playlist.list.length + ' songs.')
      boombot.respond(uid, 'Reordering my ' + playlist.list.length + ' songs.', private)
      console.log("Playlist length: " + playlist.list.length)
      var max = ((playlist.list.length-1) <= 10) ? (playlist.list.length-1) : 10
      for (i=0;i<max;i++) {
        var nextId = Math.floor(Math.random() * max)
        boombot.bot.playlistReorder(nextId,0, function(){console.log(i);})
        console.log("Song " + i + " changed.")
      }
      boombot.respond(uid, 'Reorder completed.', private)
      //boombot.bot.speak("Reorder completed.")
    })
  }
  //The below commands will modify the bots laptop. Set before he takes the stage. This command can be activated while the bot is DJ'ing, however, the laptop icon will not change until he leaves the stage and comes back.
  //set the bots laptop to an iPhone
  if (text.match(/phone up/i)) {
    boombot.respond(uid, 'iPhone mode ready master.', private)
    boombot.bot.modifyLaptop('iphone')
  }
  //set the bots laptop to a mac
  if (text.match(/fruit up/i)) {
    boombot.respond(uid, 'Apple mode ready master.', private)
    boombot.bot.modifyLaptop('mac')
  }
  //set the bots laptop to linux
  if (text.match(/nix up/i)) {
    boombot.respond(uid, 'Ubuntu mode ready master.', private)
    boombot.bot.modifyLaptop('linux')
  }
  //set the bots laptop to chromeOS
  if (text.match(/chrome up/i)) {
    boombot.respond(uid, 'Riding on chrome son.', private)
    boombot.bot.modifyLaptop('chrome')
  }
  //set the bots laptop to android
  if (text.match(/droid up/i)) {
    boombot.respond(uid, 'I am an Android. So is my phone.', private)
    boombot.bot.modifyLaptop('android')
  }
  //kill the bot. mourn his loss please.
  if (text.match(/die/i)) {
    boombot.respond(uid, 'GOODBYE CRUEL WORLD!!!', private)
    setTimeout(function() {
      boombot.bot.roomDeregister()
      process.exit(0)
    }, 3 * 1000)
  }
  /*
    AUTOVOTE
  */
  if (text.match(/autobop engage/i)) {
    boombot.respond(uid, 'Let\'s dance!', private)
    boombot.bot.bop()
    boombot.autoNod = true
  }

  if (text.match(/autobop disengage/i)) {
    boombot.respond(uid, 'Real gangstas don\'t dance.....', private)
    boombot.autoNod = false
  }
  //reload optional scripts
  if (text.match(/reload/i)) {
    // empty all the current commands
    boombot.commands = []
    // reload all the scripts
    boombot.commands = require('../../bin/boombot').LoadCommands()
  }
  /*
    PM Speech
  */
  if (text.match(/say/i)) {
    var textArray = text.split('say ')
    boombot.bot.speak(textArray[1])
  }
  /*
    BLACKLISTING
  */
  if (text.match(/blacklist/i)) {
    // need to grab the user name, convert to uid
    var uNameArray = text.split('blacklist ')
    var uName = uNameArray[1]
    // since we only have the users name we need to iterate through all the users unfortunately to find their ID
    for (user in boombot.theUsersList) {
      if (boombot.theUsersList[user].name === uName) {
        boombot.bot.bootUser(user, 'Dont come back.')
        boombot.bot.speak('please don\'t come back ' + uName)
        var bl = require('../../models/blacklist')
        var blUser = new bl(boombot.theUsersList[user], uname)
        boombot.blackList[boombot.theUsersList[user].userid] = blUser
        // write to the file
        var fs = require('fs')
        fs.writeFile('./models/store/blacklist.json', JSON.stringify(boombot.blackList), function(err) {
          if (err) {
            console.log('[ FILE SAVE ERROR ]: ' + err)
          }
        })
      }
    }
  }
  if (text.match(/listbans/i)) {
    for (banned in boombot.blackList) {
      boombot.respond(uid, boombot.blackList[banned].user.name + ' was banned by ' + boombot.blackList[banned].modName + ' on ' + boombot.blackList[banned].date, private)
    }
  }
}