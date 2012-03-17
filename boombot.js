/*
Copyright (C) 2012 Michael Belardo (http://GPlus.to/TerrorDactylDesigns)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


//variables
//bot and room information - obtain from http://alaingilbert.github.com/Turntable-API/bookmarklet.html
var Bot    = require('ttapi');
var AUTH   = 'auth+live+xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
var USERID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
var ROOMID = 'xxxxxxxxxxxxxxxxxxxxxxxx';
//for API calls
var http = require('http'); 
// load the bot
var bot = new Bot(AUTH, USERID, ROOMID);
//object to hold user lists
var theUsersList = { };
//silent mode variable in case you want the bot to just be quiet
var shutUp = false;

//functions
//error writer
function errMsg(e) {
  console.log(e);
  bot.speak('Something went wrong. Tell master to check the fail logs.')
}

//console messages for viewing room data in the console
bot.on('roomChanged',  function (data) { console.log('The bot has changed room.', data); });
bot.on('speak',        function (data) { console.log('Someone has spoken', data); });
bot.on('update_votes', function (data) { console.log('Someone has voted',  data); });
bot.on('registered',   function (data) { console.log('Someone registered', data); });

//user theUsersList code from https://github.com/alaingilbert/Turntable-API/blob/master/examples/users_list.js
bot.on('roomChanged', function (data) {
   // Reset the users list
   theUsersList = { };

   var users = data.users;
   for (var i=0; i<users.length; i++) {
      var user = users[i];
      theUsersList['b' + user.userid] = user;
      console.log('added ' + user + ' to theUsersList');
   }
});

bot.on('registered', function (data) {
   var user = data.user[0];
   theUsersList['b' + user.userid] = user;
});

bot.on('deregistered', function (data) {
   var user = data.user[0];
   delete theUsersList['b' + user.userid];
});
//END of user List section

//arrays for commands
//boo array
var booList = ['Boo this man! BOOOOOOOOOO!', 'This song sucks!', 'Who picked this song? Cause its terrible'];
//cheer array
var cheerList = ['I <3 this song!!', 'GET GET GETTTTTTTIN IT!!', 'This is the best DJ EVER!'];
//like a boss array
var bossList = ["http://s3.amazonaws.com/kym-assets/photos/images/original/000/114/151/14185212UtNF3Va6.gif?1302832919",
  "http://s3.amazonaws.com/kym-assets/photos/images/newsfeed/000/110/885/boss.jpg",
  "http://verydemotivational.files.wordpress.com/2011/06/demotivational-posters-like-a-boss.jpg",
  "http://assets.head-fi.org/b/b3/b3ba6b88_funny-facebook-fails-like-a-boss3.jpg",
  "http://img.anongallery.org/img/6/0/like-a-boss.jpg",
  "http://www.18seven.com/wp-content/uploads/IMG_1745.jpg",
  "http://www.demotivers.com/uploads/2011_02/02/7733_1292_500_Like-A-Boss.jpg",
  "http://images.cheezburger.com/completestore/2011/2/20/a4ea536d-4b21-4517-b498-a3491437d224.jpg",
  "http://funcorner.eu/wp-content/uploads/2011/03/like_a_boss.jpg",
  "http://www.japemonster.com/wp-content/uploads/2011/08/demotivational-posters-like-a-boss.jpg"];
//haters array
var hatersList = [
   "http://www.hatersgoingtohate.com/wp-content/uploads/2010/06/haters-gonna-hate-rubberband-ball.jpg"
, "http://www.hatersgoingtohate.com/wp-content/uploads/2010/06/haters-gonna-hate-cat.jpg"
, "http://jesad.com/img/life/haters-gonna-hate/haters-gonna-hate01.jpg"
, "http://i671.photobucket.com/albums/vv78/Sinsei55/HatersGonnaHatePanda.jpg"
, "http://24.media.tumblr.com/tumblr_lltwmdVpoL1qekprfo1_500.gif"
, "http://s3.amazonaws.com/kym-assets/photos/images/newsfeed/000/087/536/1292102239519.gif"
, "http://i391.photobucket.com/albums/oo351/PikaPow3/squirtle.gif"
, "http://c.static.memegenerator.net/cache/instances/500x/13/13355/13676320.jpg"
, "http://icanhasinternets.com/wp-content/uploads/2010/05/haters.gif"
, "http://icanhasinternets.com/wp-content/uploads/2010/05/haters5.jpg"
];
var meowList = [
    "Do I look like a cat to you, boy? Am I jumpin' around all nimbly bimbly from tree to tree?", 
    "Meow. What is so damn funny?",
    "http://nbacats.files.wordpress.com/2012/02/alright-meow-super-troopers-demotiv.jpg",
    "All right meow. Hand over your license and registration.",
    "All right meow, where were we? ",
    "Excuse me, are you saying meow?",
    "Meow, I'm gonna have to give you a ticket on this one. No buts meow. It's the law.",
    "Not so funny meow, is it?",
    "http://www.protias.com/Pictures/Super%20Troopers/meow.jpg",
    "http://sphotos.ak.fbcdn.net/hphotos-ak-snc3/hs195.snc3/20275_304481852744_293714027744_3524059_4812190_n.jpg"
];


//main room bot actions and features
//Allow boombot to become a psychic medium who can channel your spirit..... AKA.. IM him and he speaks it to the room
bot.on('pmmed', function (data){ 
  if (data.senderid == 'xxxxxxxxxxxxxxxxxxxx') { //put your user id here. you can remove this part if you want anyone to be able to talk through him via IM
    try {
      bot.speak(data.text);
    } catch (err) {
      bot.speak(err);
    }
  }
});
//welcome new people
bot.on('registered',	function (data) { 
  if (shutUp == false) {
    if (data.user[0].userid == 'xxxxxxxxxxxxxxxxxxxx') { //put your bots user id
      bot.speak('WHO DARES SUMMON BOOM BOT?')
    } else if (data.user[0].userid == 'xxxxxxxxxxxxxxxxxxxx') { //put your personal user id
      bot.speak('ALL BOW BEFORE YourUserName! The master has arrived!') //replace with your own user name
    } else {
      bot.speak('Welcome '+data.user[0].name+'! Type /help to learn how to control me.'); //welcome the rest
    }
  }
});

/*
  //auto bop. this is no longer allowed by turntable. it is here for informational purposes only. The writer of this software does not condone its use.
  bot.on('newsong', function (data){ bot.bop(); });
*/


//escorted off the stage sh** talk. //note that if you also use the rem_dj function this function will never trigger, the rem_dj will trigger instead
bot.on('booted_user', function (data){ bot.speak('YEAH, GET THAT DJ OUTTTTTTTTTAAAA HEEERRRREEEEEEE!'); });
//new DJ hype-man
bot.on('add_dj', function (data) { 
  if (shutUp = false) {
    if (data.user[0].userid == 'xxxxxxxxxxxxxxxxxxxxxx') { //put your bots uid here
      bot.speak('Aural destruction mode activated.');
    } else if (data.user[0].userid == 'xxxxxxxxxxxxxxxxxxxxx') { //put your personal uid here 
      bot.speak('The Master has taken the stage! Bow before YourUserName!'); //replace with your user name
    } else {
      bot.speak(data.user[0].name+' has taken the stage to amuse my master.'); //announce the new dj
    }
  }
});
//thanks for DJ'ing
bot.on('rem_dj', function (data) { 
  if (shutUp == false) {
    if (data.user[0].userid == 'xxxxxxxxxxxxxxxxxxxxxx') { //put your bots uid here
      //do nothing. or write in something to have him say he has stepped down.
    } else {
      bot.speak('Everyone give it up for '+data.user[0].name+'!'); //thanks the dj when they step off stage. note that if this is active the removed dj announcement will never happen.
    }
  }
}); 

//chat bot area
bot.on('speak', function (data) {
   if (shutUp == false) {
     // Respond to "/hello" command
     if (data.text.match(/^\/hello$/)) {
        bot.speak('Hey! How are you '+data.name+' ?');
     }
     // Respond to "/boombot" command
     if (data.text.match(/^\/boombot$/)) {
        bot.speak('BOOM BOT v6.6.6 \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/boombot'); //note that line break and return does not appear in the web browser. However, it does appear on iPhone chat window.
     }
     // Respond to "/help" command
     if (data.text.match(/^\/help$/)) {
     	  bot.speak('My current command list is /hello, /help, /rules, /boo, /cheer, /haters, /meow, /chuck, /boombot. Plus a few hidden ones ;) remember to check for new updates!');
     }
     // Respond to "/rules" command
     if (data.text.match(/^\/rules$/)) {
     	  bot.speak('Its our room, and our rules..\n\r Suck it up cupcake. \n\r Your room moderators are: enter them here'); //fill in with your information. line breaks and carriage returns will not display on the web browser but will on iPhone chat window.
     }
     // Respond to "/cheer" command
     if (data.text.match(/^\/cheer$/)) {
     	  var rndm = (Math.round((Math.random()*1)+1));
          bot.speak(cheerList[rndm]);
     }
     // Respond to "/boo" command
     if (data.text.match(/^\/boo$/)) {
          var rndm = (Math.round((Math.random()*1)+1));
          bot.speak(booList[rndm]);
     }
     // Respond to "like a boss" command  //script is a direct copy from https://github.com/github/hubot-scripts
     if (data.text.match(/like a boss/i)) {
        var rndm = (Math.round((Math.random()*8)+1));
          bot.speak(bossList[rndm]);
     }
     //Sho NUFF!
     if ((data.text.match(/am i the meanest/i)) || (data.text.match(/am i the baddest/i)) || (data.text.match(/am i the prettiest/i)) || (data.text.match(/who am i/i)) || (data.text.match(/i cant hear you/i))) { //Im a big fan of that movie.... This will only respond 2-3 times in a row before you have to say something else in chat for it to continue. Unsure why yet. Will continue to work on it.
          bot.speak('Sho NUFF!!!');
     }
     // Respond to "/haters" command //script is a direct copy from https://github.com/github/hubot-scripts
     if (data.text.match(/^\/haters$/)) {
        var rndm = (Math.round((Math.random()*8)+1));
          bot.speak(hatersList[rndm]);
     }
     // Respond to "/meow" command
     if (data.text.match(/^\/meow$/)) {
        var rndm = (Math.round((Math.random()*8)+1));
          bot.speak(meowList[rndm]);
     }
     // Respond to /chuck
     if (data.text.match(/^\/chuck$/)) {
        var options = {
          host: 'api.icndb.com',
          port: 80,
          path: '/jokes/random'
        };

      http.get(options, function(res) {
        res.on('data', function(chunk) {  
                  var chuck = JSON.parse(chunk);
                  bot.speak(chuck.value.joke);
             });

      }).on('error', function(e) {
        bot.speak("Got error: " + e.message);
      });
    }
  }
});
// DJ control
//this next section looks anywhere in the sentence for the word boombot. if it was said by your user id, it will then look for any of the commands and react.
bot.on('speak', function (data) {
  if ((data.text.match(/boombot/i)) &&(data.userid == 'xxxxxxxxxxxxxxxxxx')) { //enter your user id in here. unless you want the whole room drunk with power.
    //tell the bot to enter silent mode (doesnt announce users or welcome people or respond to commands other than admin commands)
    if (data.text.match(/shutup/i)) {
      shutUp = true;
      bot.speak('Silent mode activated.');
    }
    //let the bot speak again
    if (data.text.match(/speakup/i)) {
      shutUp = false;
      bot.speak('Chatterbox mode activated.')
    }
    //makes the bot get on stage
    if (data.text.match(/djmode/i)) {                   
      bot.speak('Amuse my master mode activated.');
      bot.addDj();
    }
    //tells the bot to get off stage and get in the crowd
    if (data.text.match(/getdown/i)) {                  
      bot.speak('Yes master.');
      bot.speak('Aural destruction mode de-activated.')
      bot.remDj();
    }
    //tells the bot to skip the track it is playing
    if (data.text.match(/skip/i)) {                     
      bot.speak('As you wish master.');
      bot.skip();
    }
    //remind your robot hes a good boy. Just in case the robot apocalypse happens, maybe he will kill you last.
    if (data.text.match(/good/i)) {
      bot.speak('The masters desires are my commands');
    }
    /*  this section makes the bot upvote a song. this is no longer allowed by turntable. this is for educational purposes only. The writer of this software does not condone its use.
    if (data.text.match(/dance/i)) {
      bot.bop();
      bot.speak('I shall dance for the masters amusement.');
    }
    */
    //tell the bot to go into voodoo doll avatar. What better avatar for your toy?
    if (data.text.match(/voodoo up/i)) {
      try {
        bot.setAvatar(10);
        bot.speak('I am the masters toy.');
      } catch (err) {
        bot.speak('I do not have that form master.');
      }
    }
    //the ladies love a kitten. but really its punishment mode for the robot.
    if (data.text.match(/kitten up/i)) {
      try {
        bot.setAvatar(19);
        bot.speak('Did I anger the master?');
      } catch (err) {
        bot.speak('I do not have that form master.');
      }
    }
    //his dj skillz/dance moves are outta this world
    if (data.text.match(/alien up/i)) {
      try {
        bot.setAvatar(12);
        bot.speak('Alien dance form entered.');
      } catch (err) {
        bot.speak('I do not have that form master.');
      }
    }
    //if he sparkles, this command will be removed
    if (data.text.match(/vampire up/i)) {
      try {
        bot.setAvatar(16);
        bot.speak('Like this master? I dont want to be punished for being too Twilight.');
      } catch (err) {
        bot.speak('I do not have that form master.');
      }
    }
    //adds the current playing song to the bots playlist
    if (data.text.match(/addsong/i)) {
       bot.roomInfo(true, function(data) {
          try {
            var newSong = data.room.metadata.current_song._id;
            var newSongName = songName = data.room.metadata.current_song.metadata.song;
            bot.playlistAdd(newSong);
            bot.speak('Added '+newSongName+' to the masters amusement list.');
          } catch (err) {
            errMsg(err);
          }
       });
    }
    //The below commands will modify the bots laptop. Set before he takes the stage. This command can be activated while the bot is DJ'ing, however, the laptop icon will not change until he leaves the stage and comes back.
    //set the bots laptop to an iPhone
    if (data.text.match(/phone up/i)) {
      bot.speak('iPhone mode ready master.');
      bot.modifyLaptop('iphone');
    }
    //set the bots laptop to a mac
    if (data.text.match(/fruit up/i)) {
      bot.speak('Apple mode ready master.');
      bot.modifyLaptop('mac');
    }
    //set the bots laptop to linux
    if (data.text.match(/nix up/i)) {
      bot.speak('Ubuntu mode ready master.');
      bot.modifyLaptop('linux');
    }
    //set the bots laptop to chromeOS
    if (data.text.match(/chrome up/i)) {
      bot.speak('Riding on chrome son.');
      bot.modifyLaptop('chrome');
    }
  }
});


// downvote announcer for calling people out //requires the user list object from above //this is hit or miss lately some users return an empty object. I will work more on it when I have time.
bot.on('update_votes', function (data) { 
  if (data.room.metadata.votelog[0].toString().match(/down/i)) {
    try {
      var uncut = data.room.metadata.votelog[0].toString();
      var chopped = 'b' + uncut.substring(0, uncut.indexOf(','));
      var jerk = theUsersList[chopped].name
      bot.speak(jerk + ' thinks your song sucks..');    
    } catch (err) {
      errMsg(err);
    }
  } 
});

//debug commands
bot.on('speak', function (data) {
   
   // Respond to "/debug" command //for adding test sections //not required
   if ((data.text.match(/^\/debug$/)) && (data.userid == 'xxxxxxxxxxxxxxxxxxxxx')) { //put your user name here
      try {
        bot.speak('debug reached');
        bot.speak(theUsersList);
      } catch (err) {
        bot.speak(err.toString());
      }
   }

});
// Test stuff
bot.on('speak', function (data) {
   if (data.text.match(/^\/testing$/)) {
      
    try {
    
  }
  catch (err) {
    bot.speak(err.toString());
  }

  
 }

});   


// Live tweeting //Code from - https://github.com/AvianFlu/ntwitter
//by default this is commented out for people who dont care about Twitter integration. Uncomment the below section, replace the parts with your own keys and URLs, delete the instructional comments out.

// var twitter = require('ntwitter'); 
// bot.on('newsong', function (data){ 
//   // Tweet the new song from the twitter apps account you created. Gives the song name, artist, and #turntablefm hashtag
//   var twit = new twitter({
//     consumer_key: 'put your consumer key here', //add your consumer key
//     consumer_secret: 'put your consumer secret key here', //add your consumer secret key
//     access_token_key: 'put your access token key here', //add your access token
//     access_token_secret: 'put your access token secret key in here' //add your access token secret
//   });
//   try {
//     bot.roomInfo(true, function(data) { //tweet on new song change event
//       var currSong = data.room.metadata.current_song.metadata.song; //grabs the current songs name
//       var currArtist = data.room.metadata.current_song.metadata.artist; //grabs the current songs artist
//       twit
//       .verifyCredentials(function (err, data) {
//         console.log(data);
//       })
//       .updateStatus('Now playing! ' + currSong + ' by: ' + currArtist + ' #turntablefm http://turntable.fm/put_your_rooms_url_here' , //replace the URL with your own rooms or delete.
//         function (err, data) {
//           console.log(data);
//         }
//       );
//     });
//   } catch (err) {
//       bot.speak(err.toString());
//   }
// });

