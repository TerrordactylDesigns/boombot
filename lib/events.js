/*
  Event handlers for TTAPI events
*/
//eventEmitter for roomChanged
exports.roomChangedEvent = function(boombot, data){
  //log room entrance to console if config is set to true
  if (boombot.config.consolelog) {
    console.log('[ Entrance ] : ' + data.room.name);
  }
  // Reset the users list object
  boombot.theUsersList = { };
  //add users to the users list object
  var users = data.users;
  for (var i=0; i<users.length; i++) {
    var DJ = require('../models/dj');
    var user = new DJ(users[i].name, users[i].userid);
    boombot.theUsersList[user.userid] = user;
    if (boombot.config.consolelog) {
      console.log('[ EVENT ] : added ' + user.name + ' to theUsersList');
    }
  }
}
//eventEmitter for registered
exports.registeredEvent = function(boombot, data) {
  //log registration to console if config is set to true
  if (boombot.config.consolelog) {
    console.log('[ Registered ] : ' + data.user[0].name);
  }
  // check if user is in the blacklist
  if (Object.keys(boombot.blackList).length > 0) {
    for (banned in boombot.blackList) {
      if (boombot.blacklist[banned] && (data.user[0].userid == boombot.blackList[banned].user.userid)) {
        boombot.bot.bootUser(data.user[0].userid, 'You were blacklisted. Please don\'t come back.');
        return;
      }
    }
  }
  //add user to the users list object
  var DJ = require('../models/dj');
  var user = new DJ(data.user[0].name, data.user[0].userid);
  boombot.theUsersList[user.userid] = user;
  if (boombot.config.consolelog) {
    console.log('[ EVENT ] : added ' + user.name + ' to theUsersList');
  }
  //chat announcer
  if (boombot.shutUp == false) {
    if (data.user[0].userid == boombot.config.botinfo.userid) { //boombot announces himself
      boombot.bot.speak(boombot.config.responses.botwelcome)
    } else if (data.user[0].userid == boombot.config.admin.userid) { //if the master arrives announce him specifically
      boombot.bot.speak(boombot.config.responses.adminwelcome);
    } else {
      //check to see if the user is a mod, if not PM them
      boombot.bot.roomInfo(true, function(data2) {
        var modArray = data2.room.metadata.moderator_id;
        if (modArray.contains(data.user[0].userid)) { //user is a room mod
          boombot.bot.speak(boombot.config.responses.modwelcome.replace('XXX', data.user[0].name));
        } else {
          boombot.bot.pm(boombot.config.responses.welcomepm, data.user[0].userid, function(data) { }); //PM the user
          boombot.bot.speak(boombot.config.responses.welcome.replace('XXX', data.user[0].name)); //welcome the rest
        }
      });
    }
  }
}
//eventEmitter for registered
exports.deregisteredEvent = function(boombot, data) {
  //remove the person from the user list
  var user = data.user[0];
  delete boombot.theUsersList[user.userid];
  if (boombot.djQueue.contains(data.user[0].userid)) {
    boombot.RemoveFromQueue(data.user[0].userid, data.user[0].name);
  }
}
//eventEmitter for update_votes
exports.update_votesEvent = function(boombot, data) {
  //check for down tag in vote
  if (data.room.metadata.votelog[0].toString().match(/down/i)) {
    try {
      var uncut = data.room.metadata.votelog[0].toString();
      var chopped = uncut.substring(0, uncut.indexOf(','));
      var jerk = boombot.theUsersList[chopped].name
      boombot.bot.speak(jerk + ' thinks your song sucks..');
    } catch (err) {
      //initial downvotes go by without a user ID to trap. Also if you have never upvoted your downvotes go by with no ID.
      boombot.bot.speak("Ouch. Someone thinks you're lame.....")
    }
    if (boombot.config.consolelog) {
      console.log("[ LAME ]");
    }
  }
}
//eventEmitter for newsong
exports.newsongEvent = function(boombot, data) {
  //on song start we will reset the snagCounter
  boombot.snagCounter = 0;
  //auto bop
  if (boombot.autoNod) {
    setTimeout(function(){
      boombot.bot.bop();
    }, 10 * 1000);
  }
  /*
    if the queue is on and the array has more than 0:
    remove any dj that is not the first in array,
    after 30 seconds remove them from the array - announce next if there
  */
  boombot.theUsersList[data.room.metadata.current_dj].IncPlays();
  if (boombot.queue) {
    //  get the array of current DJs
    var currDjs = data.room.metadata.djs;
    //  find the next DJ allowed up
    boombot.runQueue(currDjs);
  }
}
//eventEmitter for snagged
exports.snaggedEvent = function(boombot, data) {
  //increment the snag counter when a song is snagged
  boombot.snagCounter++;
}
//eventEmitter for endsong
exports.endsongEvent = function(boombot, data) {
  //if stats true report the song information
  if (boombot.config.stats && boombot.shutUp == false) {
    boombot.bot.speak(data.room.metadata.current_song.metadata.song + " by " + data.room.metadata.current_song.metadata.artist + " got :+1: " + data.room.metadata.upvotes + " :-1: " +  data.room.metadata.downvotes + " <3 " + boombot.snagCounter);
  }
  if (boombot.queue) {
    var djToRem = data.room.metadata.current_dj;
    if (boombot.theUsersList[djToRem].plays >= boombot.queueLength) {
      boombot.bot.remDj(djToRem);
    }
  }
}
//eventEmitter for update_user
exports.update_userEvent = function(boombot, data) {

}
//eventEmitter for booted_user
exports.booted_userEvent = function(boombot, data) {
  if (boombot.shutUp == false) {
    //talk smack to booted users
    boombot.bot.speak('So glad they are gone.....');
  }
}
//eventEmitter for add_dj
exports.add_djEvent = function(boombot, data) {
  if (boombot.shutUp == false) {
    //announce the new DJ
    if (data.user[0].userid == boombot.config.botinfo.userid) {
      boombot.bot.speak(boombot.config.responses.botdjmode);
    } else if (data.user[0].userid == boombot.config.admin.userid) {
      boombot.bot.speak(boombot.config.responses.masterdjmode.replace('XXX', data.user[0].name));
    } else {
      boombot.bot.speak(boombot.config.responses.djmode.replace('XXX', data.user[0].name));
    }
  }
  //if more than 1 real DJ are on decks the bot hops down unless DJMode is true
  boombot.bot.roomInfo(true, function(data) {
    var currDJs = data.room.metadata.djs;
    var countDJs = currDJs.length;
    var isDJ = false;
    //have to loop through the array apparently no contains method in js
    for (i = 0; i < countDJs; i++) {
      if (currDJs[i] == boombot.config.botinfo.userid) {
        isDJ = true;
      }
    }
    if ((isDJ) && (boombot.DJMode == false) && (countDJs > 2)) {
      boombot.bot.speak("Looks like the rooms a rockin, I'll step down.");
      boombot.bot.remDj();
    }
  });
  if (boombot.queue) {
    //  check the users ID and compare to position 0 of q array
    if (data.user[0].userid != boombot.djQueue[0] && boombot.djQueue.length > 0) {
      //  yank the user if they are not position 0
      boombot.yank = true;
      boombot.bot.remDj(data.user[0].userid);
      boombot.bot.speak('Not your turn @' + data.user[0].name + " type q to see the order, or q+ to add yourself.");
    } else {
      boombot.djQueue.splice(0,1);
      boombot.nextUp = {};
      boombot.theUsersList[data.user[0].userid].ClearPlays();
    }
  }
}
//eventEmitter for rem_dj
exports.rem_djEvent = function(boombot, data) {
  //thank the DJ for playing tunes
  if (data.user[0].userid != boombot.config.botinfo.userid && boombot.shutUp == false) {
    boombot.bot.speak('Everyone give it up for '+data.user[0].name+'!');
  }
  //if the DJs drop to just 1 we will save youuuuuu
  boombot.bot.roomInfo(true, function(data) {
      var currDJs = data.room.metadata.djs;
      var countDJs = currDJs.length;
      if (countDJs <= 1) {
        boombot.bot.speak("Forget the whales! SAVE THE BEATS!");
        boombot.bot.addDj();
      }
  });
  if (boombot.queue) {
    if (boombot.djQueue.length > 0) {
      if (boombot.yank) {
        boombot.yank = false;
      } else {
        boombot.bot.roomInfo(true, function(data2) {
          var currDjs = data2.room.metadata.djs;
          boombot.runQueue(currDjs);
        });
      }
    }
  }
}
// single handler for speech and pm
exports.handleCommand = function(boombot, data, private) {
  // we need 3 main things
  // username, userid, and text
  // pm does not send name. userid on pm is named different
  var uname
    , uid
    , text;
  if (private) {
    uname = ''
    uid   = data.senderid
  } else {
    uname = data.name
    uid   = data.userid
  }
  text = data.text
  //Log speak in console if config is set to true
  if (boombot.config.consolelog && !(private)) {
      console.log('[ Chat: ' + uname +' ] : ' + text);
  } else if (boombot.config.consolelog && private) {
    console.log('[ PM: ' + uid +' ] : ' + text);
  }
  //if the chat was a command, run the command
  // TODO
  // make a way to have optional triggers
  bot.roomInfo(true, function(data2) {
    var modArray = data2.room.metadata.moderator_id;
    /*
      MASTER COMMANDS
    */
    if ((uid == boombot.config.admin.userid
        || (modArray.contains(uid) && boombot.config.moderatorControl))
        && text.toLowerCase().indexOf(boombot.config.botinfo.botname) != -1) {
      var master_controls = require('../lib/core/master_controls').script;
      master_controls(boombot, text, uname, uid, private);
    } else {
      /*
        ROOM MODERATOR COMMANDS
      */
      if (modArray.contains(uid)) {
        for (i = 0; i < boombot.modCommands.length; i++) {
          if (boombot.modCommands[i].trigger == text) {
            boombot.modCommands[i].script(boombot, text, uname, uid, private);
          }
        }
      }
      if (text.toLowerCase() == 'q') { //had to put this here for now due to the way i parse triggers.
        if (boombot.config.queue) {
          if (boombot.queue) {
            var x = boombot.djQueue.length;
            var pos;
            var userName;
            if (x === 0) {
              boombot.respond(uid, 'No ones waiting.', private);
            } else {
              var queueOrder = "";
              for (i = 0; i < x; i++) {
                pos = i + 1;
                queueOrder += pos + ': @' + boombot.theUsersList[boombot.djQueue[i]].name + ' ';
              }
              boombot.respond(uid, queueOrder, private);
            }
          } else {
            boombot.respond(uid, 'free for all.... hop up!', private);
          }
        }
      } else {
        /*
          PEASANT COMMANDS
        */
        for (i =0; i < boombot.commands.length; i++) {
          // parse trigger. If begins with a / make it a matching command
          // if it doesnt start with a / we need to check for it anywhere in the text
          if ((boombot.commands[i].trigger[0] == "/" && boombot.commands[i].trigger.toLowerCase() == text.toLowerCase())
            || (boombot.commands[i].trigger[0] != "/" && text.toLowerCase().indexOf(boombot.commands[i].trigger.toLowerCase()) != -1 && uid != boombot.config.botinfo.userid)) {
            try {
              boombot.commands[i].script(boombot, text, uname, uid, private);
            } catch (err) {
              boombot.respond(uid, 'Your script is bad! Check the log for details.', private);
              console.log('[ *ERROR* ] Script error: ' + err);
            }
          }
        }
      }
    }
  });
}