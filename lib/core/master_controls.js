/**/// Public: Master commands. Now also room moderators if allowed in config file.
/**///
/**/// Args
/**/// boombot - an instance of a boombot
/**/// data - the data from the event handler
/**///
/**/// Returns
/**/// return - runs commands for bot control by the master
exports.script = function(boombot, data) {
  //tell the bot to enter silent mode (doesnt announce users or welcome people or respond to commands other than admin commands)
  if (data.text.match(/shutup/i)) {
    boombot.shutUp = true;
    boombot.bot.speak('Silent mode activated.');
  }
  //let the bot speak again
  if (data.text.match(/speakup/i)) {
    boombot.shutUp = false;
    boombot.bot.speak('Chatterbox mode activated.');
  }
  //makes the bot get on stage
  if (data.text.match(/djmode/i)) {
    boombot.DJMode = true;
    boombot.bot.addDj();
  }
  //tells the bot to get off stage and get in the crowd
  if (data.text.match(/getdown/i)) {
    boombot.DJMode = false;
    boombot.bot.speak('Aural destruction mode de-activated.')
    boombot.bot.remDj();
  }
  //tells the bot to skip the track it is playing
  if (data.text.match(/skip/i)) {
    boombot.bot.speak('As you wish master.');
    boombot.bot.skip();
  }
  //remind your robot hes a good boy. Just in case the robot apocalypse happens, maybe he will kill you last.
  if (data.text.match(/good/i)) {
    boombot.bot.speak('The masters desires are my commands');
  }
  //this section makes the bot upvote a song.
  if (data.text.match(/dance/i)) {
    boombot.bot.bop();
    boombot.bot.speak('I shall dance for the masters amusement.');
  }
  //tell the bot to go into voodoo doll avatar. What better avatar for your toy?
  if (data.text.match(/voodoo up/i)) {
    try {
      boombot.bot.setAvatar(10);
      boombot.bot.speak('I am the masters toy.');
    } catch (err) {
      boombot.bot.speak('I do not have that form master.');
    }
  }
  //the ladies love a kitten. but really its punishment mode for the robot.
  if (data.text.match(/kitten up/i)) {
    try {
      boombot.bot.setAvatar(19);
      boombot.bot.speak('Did I anger the master?');
    } catch (err) {
      boombot.bot.speak('I do not have that form master.');
    }
  }
  //his dj skillz/dance moves are outta this world
  if (data.text.match(/alien up/i)) {
    try {
      boombot.bot.setAvatar(12);
      boombot.bot.speak('Alien dance form entered.');
    } catch (err) {
      boombot.bot.speak('I do not have that form master.');
    }
  }
  //if he sparkles, this command will be removed
  if (data.text.match(/vampire up/i)) {
    try {
      boombot.bot.setAvatar(16);
      boombot.bot.speak('Like this master? I dont want to be punished for being too Twilight.');
    } catch (err) {
      boombot.bot.speak('I do not have that form master.');
    }
  }
  //adds the current playing song to the bots playlist
  if (data.text.match(/addsong/i)) {
    boombot.bot.roomInfo(true, function(data2) {
      try {
        var newSong = data2.room.metadata.current_song._id;
        var newSongName = songName = data2.room.metadata.current_song.metadata.song;
        boombot.bot.snag();
        boombot.bot.playlistAdd(newSong);
        boombot.bot.speak('Added '+newSongName+' to the masters amusement list.');
      } catch (err) {
        errMsg(err);
      }
    });
  }
  //The below commands will modify the bots laptop. Set before he takes the stage. This command can be activated while the bot is DJ'ing, however, the laptop icon will not change until he leaves the stage and comes back.
  //set the bots laptop to an iPhone
  if (data.text.match(/phone up/i)) {
    boombot.bot.speak('iPhone mode ready master.');
    boombot.bot.modifyLaptop('iphone');
  }
  //set the bots laptop to a mac
  if (data.text.match(/fruit up/i)) {
    boombot.bot.speak('Apple mode ready master.');
    boombot.bot.modifyLaptop('mac');
  }
  //set the bots laptop to linux
  if (data.text.match(/nix up/i)) {
    boombot.bot.speak('Ubuntu mode ready master.');
    boombot.bot.modifyLaptop('linux');
  }
  //set the bots laptop to chromeOS
  if (data.text.match(/chrome up/i)) {
    boombot.bot.speak('Riding on chrome son.');
    boombot.bot.modifyLaptop('chrome');
  }
  //set the bots laptop to android
  if (data.text.match(/droid up/i)) {
    boombot.bot.speak('I am an Android. So is my phone.');
    boombot.bot.modifyLaptop('android');
  }
  //kill the bot. mourn his loss please.
  if (data.text.match(/die/i)) {
    boombot.bot.speak('GOODBYE CRUEL WORLD!!!');
    setTimeout(function() {
      boombot.bot.roomDeregister();
      process.exit(0);
    }, 3 * 1000);
  }
  /*
    AUTOVOTE
  */
  if (data.text.match(/autobop engage/i)) {
    boombot.bot.speak("Let's dance!");
    boombot.bot.bop();
    boombot.autoNod = true;
  }

  if (data.text.match(/autobop disengage/i)) {
    boombot.bot.speak("Real gangstas don't dance.....");
    boombot.autoNod = false;
  }
  //reload optional scripts
  if (data.text.match(/reload/i)) {
    // empty all the current commands
    boombot.commands = [];
    // reload all the scripts
    boombot.commands = require('../../bin/boombot').LoadCommands();
  }
  /*
    BLACKLISTING
  */
  if (data.text.match(/blacklist/i)) {
    // need to grab the user name, convert to uid
    var uNameArray = data.text.split('blacklist ');
    var uName = uNameArray[1];
    // since we only have the users name we need to iterate through all the users unfortunately to find their ID
    for (user in boombot.theUsersList) {
      if (boombot.theUsersList[user].name === uName) {
        boombot.bot.bootUser(user, 'Dont come back.');
        boombot.bot.speak('please don\'t come back ' + uName);
        var bl = require('../../models/blacklist');
        var blUser = new bl(boombot.theUsersList[user], data.name);
        boombot.blackList[boombot.theUsersList[user].userid] = blUser;
        // write to the file
        var fs = require('fs');
        fs.writeFile('./models/store/blacklist.json', JSON.stringify(boombot.blackList), function(err) {
          if (err) {
            console.log('[ FILE SAVE ERROR ]: ' + err)
          }
        });
      }
    }
  }
  if (data.text.match(/listbans/i)) {
    for (banned in boombot.blackList) {
      boombot.bot.speak(boombot.blackList[banned].user.name + ' was banned by ' + boombot.blackList[banned].modName + ' on ' + boombot.blackList[banned].date);
    }
  }
}