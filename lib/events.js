/*
  Event handlers for TTAPI events
*/
/**/// Public: roomChangedEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi roomChanged data
exports.roomChangedEvent = function(boombot, data){
  // log room entrance to console if config is set to true
  if (boombot.config.consolelog)
    console.log('[ Entrance ] : ' + data.room.name)
  // Reset the users list object
  boombot.theUsersList = { }
  // add users to the users list object
  var users   = data.users
    , currDj  = (data.room.metadata.current_song) ? data.room.metadata.current_song.djid : null
  for (var i=0; i<users.length; i++) {
    var DJ = require('../models/dj')
      , user = new DJ(users[i].name, users[i].userid)
    boombot.theUsersList[user.userid] = user
    if (boombot.config.consolelog)
      console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')
  }
  // set current DJs playcount to 1
  if (currDj !== null)
    boombot.theUsersList[currDj].IncPlays()
}
/**/// Public: registeredEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi registered data
exports.registeredEvent = function(boombot, data) {
  //log registration to console if config is set to true
  if (boombot.config.consolelog)
    console.log('[ Registered ] : ' + data.user[0].name)
  // check if user is in the blacklist
  if (Object.keys(boombot.blackList).length > 0) {
    for (banned in boombot.blackList) {
      if (boombot.blackList[banned] && (data.user[0].userid == boombot.blackList[banned].user.userid)) {
        boombot.bot.bootUser(data.user[0].userid, boombot.config.responses.blacklisted)
        return
      }
    }
  }
  //add user to the users list object
  var DJ = require('../models/dj')
    , user = new DJ(data.user[0].name, data.user[0].userid)
  boombot.theUsersList[user.userid] = user
  if (boombot.config.consolelog)
    console.log('[ EVENT ] : added ' + user.name + ' to theUsersList')
  //chat announcer
  if (boombot.shutUp == false) {
    if (data.user[0].userid == boombot.config.botinfo.userid) //boombot announces himself
      boombot.bot.speak(boombot.config.responses.botwelcome)
    else if (data.user[0].userid == boombot.config.admin.userid) //if the master arrives announce him specifically
      boombot.bot.speak(boombot.config.responses.adminwelcome)
    else {
      //check to see if the user is a mod, if not PM them
      boombot.bot.roomInfo(true, function(data2) {
        var modArray = data2.room.metadata.moderator_id
        if (modArray.indexOf(data.user[0].userid) !== -1) { //user is a room mod
          boombot.bot.speak(boombot.config.responses.modwelcome.replace('XXX', data.user[0].name))
        } else {
          boombot.bot.pm(boombot.config.responses.welcomepm, data.user[0].userid, function(data) { }) //PM the user
          boombot.bot.speak(boombot.config.responses.welcome.replace('XXX', data.user[0].name)) //welcome the rest
        }
      })
    }
  }
}
/**/// Public: deregisteredEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi deregistered data
exports.deregisteredEvent = function(boombot, data) {
  //remove the person from the user list
  var user = data.user[0]
  delete boombot.theUsersList[user.userid]
  if (boombot.djQueue.indexOf(data.user[0].userid) !== -1)
    boombot.RemoveFromQueue(data.user[0].userid, data.user[0].name)
}
/**/// Public: update_votesEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi update_votes data
exports.update_votesEvent = function(boombot, data) {
  //check for down tag in vote
  if (data.room.metadata.votelog[0].toString().match(/down/i)) {
    try {
      var uncut = data.room.metadata.votelog[0].toString()
        , chopped = uncut.substring(0, uncut.indexOf(',') !== -1)
        , jerk = boombot.theUsersList[chopped].name
      boombot.bot.speak(boombot.config.responses.namedlame.replace('XXXX', jerk))
    } catch (err) {
      //initial downvotes go by without a user ID to trap. Also if you have never upvoted your downvotes go by with no ID.
      boombot.bot.speak(boombot.config.responses.unnamedlame)
    }
    if (boombot.config.consolelog)
      console.log('[ LAME ]')
  }
}
/**/// Public: newsongEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi newsong data
exports.newsongEvent = function(boombot, data) {
  //on song start we will reset the snagCounter
  boombot.snagCounter = 0
  //auto bop
  if (boombot.autoNod) {
    setTimeout(function(){
      boombot.bot.bop()
    }, 10 * 1000)
  }
  /*
    if the queue is on and the array has more than 0:
    remove any dj that is not the first in array,
    after 30 seconds remove them from the array - announce next if there
  */
  boombot.theUsersList[data.room.metadata.current_dj].IncPlays()
  if (boombot.queue) {
    //  get the array of current DJs
    var currDjs = data.room.metadata.djs
    //  find the next DJ allowed up
    boombot.runQueue()
  }
  var currSong    = data.room.metadata.current_song.metadata.song
    , currArtist  = data.room.metadata.current_song.metadata.artist
  /*
    Twitter! Social!
  */
  if (boombot.config.twitter.tweet) {
    // Tweet the new song. Give the DJ name, the song, and #turntablefm hashtag, and room url
    var twitter = require('ntwitter')
      , twit    = new twitter({
      consumer_key: boombot.config.twitter.consumer_key,
      consumer_secret: boombot.config.twitter.consumer_secret,
      access_token_key: boombot.config.twitter.access_token_key,
      access_token_secret: boombot.config.twitter.access_token_secret
    });
    try {
      boombot.bot.roomInfo(true, function(data) {
        var currDJ = boombot.theUsersList[data.room.metadata.current_dj].name;
        twit
        .verifyCredentials(function (err, data) {
          console.log(data);
        })
        .updateStatus(currDJ + ' is now playing ' + currSong + ' by: ' + currArtist + ' #turntablefm ' + boombot.config.twitter.roomurl,
          function (err, data) {
            console.log(data);
          }
        );
      });
    } catch (err) {
        boombot.bot.speak(err.toString());
    }
  }
  /*
    Last FM! Scrobble!
  */
  if (boombot.config.lastfm.use && boombot.config.lastfm.scrobble && data.room.metadata.current_song.metadata.length > 30) {
    var song      = {artist:currArtist, track:currSong}
      , timer     = data.room.metadata.current_song.metadata.length / 2 < 60 * 4 ? data.room.metadata.current_song.metadata.length / 2 : 60 * 4
      , self      = this
    // update now playing
    boombot.scribble.NowPlaying(song)
    // Last.fm scrobble guidelines
    // scrobble after 50% of the song or 4 minutes
    // whichever is shorter
    // store the current song to compare against when its scrobble time
    boombot.scrobble = setTimeout(function() {
      boombot.scrobble = null
      boombot.scribble.Scrobble(song)
    }, timer * 1000)
  }
}
/**/// Public: snaggedEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi snagged data
exports.snaggedEvent = function(boombot, data) {
  //increment the snag counter when a song is snagged
  boombot.snagCounter++
}
/**/// Public: endsongEvent
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi endsong data
exports.endsongEvent = function(boombot, data) {
  //if stats true report the song information
  if (boombot.config.stats && boombot.shutUp == false)
    boombot.bot.speak(data.room.metadata.current_song.metadata.song + " by " + data.room.metadata.current_song.metadata.artist + " got :+1: " + data.room.metadata.upvotes + " :-1: " +  data.room.metadata.downvotes + " <3 " + boombot.snagCounter)
  if (boombot.queue) {
    var djToRem = data.room.metadata.current_dj;
    if (boombot.theUsersList[djToRem].plays >= boombot.queueLength)
      boombot.bot.remDj(djToRem)
  }
  if (boombot.scrobble)
    clearTimeout(boombot.scrobble)
}
/**/// Public: update_user
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi update_user data
exports.update_userEvent = function(boombot, data) {

}
/**/// Public: booted_user
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi booted_user data
exports.booted_userEvent = function(boombot, data) {
  //talk smack to booted users
  if (boombot.shutUp == false)
    boombot.bot.speak(boombot.config.responses.booteduser)
}
/**/// Public: add_dj
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi add_dj data
exports.add_djEvent = function(boombot, data) {
  if (boombot.shutUp == false) {
    //announce the new DJ
    if (data.user[0].userid == boombot.config.botinfo.userid)
      boombot.bot.speak(boombot.config.responses.botdjmode)
    else if (data.user[0].userid == boombot.config.admin.userid)
      boombot.bot.speak(boombot.config.responses.masterdjmode.replace('XXX', data.user[0].name))
    else
      boombot.bot.speak(boombot.config.responses.djmode.replace('XXX', data.user[0].name))
  }
  //if more than 1 real DJ are on decks the bot hops down unless DJMode is true
  boombot.bot.roomInfo(true, function(data) {
    var currDJs = data.room.metadata.djs
      , countDJs = currDJs.length
      , isDJ = false
    //have to loop through the array apparently no contains method in js
    for (i = 0; i < countDJs; i++) {
      if (currDJs[i] == boombot.config.botinfo.userid)
        isDJ = true
    }
    if ((isDJ) && (boombot.DJMode == false) && (countDJs > 2)) {
      boombot.bot.speak(boombot.config.responses.autodjdown)
      boombot.bot.remDj()
    }
  })
  if (boombot.queue) {
    //  check the users ID and compare to position 0 of q array
    if (data.user[0].userid != boombot.djQueue[0] && boombot.djQueue.length > 0) {
      //  yank the user if they are not position 0
      boombot.yank = true
      boombot.bot.remDj(data.user[0].userid)
      boombot.bot.speak(boombot.config.responses.notyourturn.replace('XXXX', data.user[0].name))
    } else {
      boombot.djQueue.splice(0,1)
      boombot.nextUp = {}
      boombot.theUsersList[data.user[0].userid].ClearPlays()
    }
  }
}
/**/// Public: rem_dj
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi rem_dj data
exports.rem_djEvent = function(boombot, data) {
  //thank the DJ for playing tunes
  if (data.user[0].userid != boombot.config.botinfo.userid && boombot.shutUp == false)
    boombot.bot.speak(boombot.config.responses.djsteppeddown.replace('XXXX', data.user[0].name))
  //if the DJs drop to just 1 we will save youuuuuu
  boombot.bot.roomInfo(true, function(data) {
      var currDJs = data.room.metadata.djs
        , countDJs = currDJs.length
      if (countDJs <= 1) {
        boombot.bot.speak(boombot.config.responses.autodjup)
        boombot.bot.addDj()
      }
  })
  if (boombot.queue) {
    if (boombot.djQueue.length > 0) {
      if (boombot.yank)
        boombot.yank = false
      else {
        boombot.bot.roomInfo(true, function(data2) {
          var currDjs = data2.room.metadata.djs
          boombot.runQueue()
        })
      }
    }
  }
}
/**/// Public: single handler for speech and pm
/**///
/**/// Args
/**/// boombot  - an instance of the bot
/**/// data     - ttapi speech/PM data
/**/// private  - bool value for PM
exports.handleCommand = function(boombot, data, private) {
  // we need 3 main things
  // username, userid, and text
  // pm does not send name. userid on pm is named different
  var uname
    , uid
    , text
    , ran = false
  if (private) {
    uname = ''
    uid   = data.senderid
  } else {
    uname = data.name
    uid   = data.userid
  }
  text = data.text
  //Log speak in console if config is set to true
  if (boombot.config.consolelog && !(private))
    console.log('[ Chat: ' + uname +' ] : ' + text)
  else if (boombot.config.consolelog && private)
    console.log('[ PM: ' + uid +' ] : ' + text)
  //if the chat was a command, run the command
  // TODO
  // make a way to have optional triggers
  bot.roomInfo(true, function(data2) {
    var modArray = data2.room.metadata.moderator_id;
    /*
      MASTER COMMANDS
    */
    if ((uid == boombot.config.admin.userid
        || (modArray.indexOf(uid) !== -1 && boombot.config.moderatorControl))
        && text.toLowerCase().indexOf(boombot.config.botinfo.botname) != -1) {
      var master_controls = require('../lib/core/master_controls').script
      master_controls(boombot, text, uname, uid, private)
    } else {
      if (boombot.shutUp == false) {
        /*
          ROOM MODERATOR COMMANDS
        */
        if (modArray.indexOf(uid) !== -1) {
          for (i = 0; i < boombot.modCommands.length; i++) {
            // parse trigger. If begins with a / make it a matching command
            // if it doesnt start with a / we need to check for it anywhere in the text
            if ((boombot.modCommands[i].trigger[0] == "/" && boombot.modCommands[i].trigger.toLowerCase() == text.toLowerCase())
              || (boombot.modCommands[i].trigger[0] != "/" && text.toLowerCase().indexOf(boombot.modCommands[i].trigger.toLowerCase()) != -1 && uid != boombot.config.botinfo.userid)) {
              ran = true
              boombot.modCommands[i].script(boombot, text, uname, uid, private)
            }
          }
        }
        if (text.toLowerCase() == 'q') { //had to put this here for now due to the way i parse triggers.
          ran = true
          if (boombot.config.queue) {
            if (boombot.queue) {
              var x = boombot.djQueue.length
                , pos
                , userName
              if (x === 0)
                boombot.respond(uid, boombot.config.responses.emptyq, private)
              else {
                var queueOrder = ""
                for (i = 0; i < x; i++) {
                  pos = i + 1
                  queueOrder += pos + ': @' + boombot.theUsersList[boombot.djQueue[i]].name + ' '
                }
                boombot.respond(uid, queueOrder, private)
              }
            } else {
              boombot.respond(uid, boombot.config.responses.freeforall, private)
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
              ran = true
              try {
                boombot.commands[i].script(boombot, text, uname, uid, private)
              } catch (err) {
                boombot.respond(uid, 'Your script is bad! Check the log for details.', private)
                console.log('[ *ERROR* ] Script error: ' + err)
              }
            }
          }
        } // end peasant commands
      }
      /*
        MOD GROUP CHAT
      */
      if (private && !ran && modArray.indexOf(uid) !== -1 && boombot.config.moderatorChat && boombot.theUsersList[uid]) {
        // grab the user who PM'd and find his name and such
        uname = boombot.theUsersList[uid].name
        for (i = 0; i < modArray.length; i++) {
          if (boombot.theUsersList[modArray[i]] && modArray[i] != uid && modArray[i] != boombot.config.botinfo.userid)
            boombot.respond(modArray[i], '[' + uname + ']: ' + text, private)
        }
      }
    }
  })
}
