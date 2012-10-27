/**/// Public: Core scripts for users
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
module.exports = [
  {
    'trigger': '/boombot',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, 'BOOM BOT ' + boombot.version + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/boombot', private);
    }
  },
  {
    'trigger' : '/help',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var response = 'My current commands are: ' + boombot.commands.filter(function(command) {
        return command.listed;
      }).map(function(command){
        return command.trigger;
      }).sort().join(', ');
      boombot.respond(uid, response, private);
    }
  },
  {
    'trigger': '/lyrics',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var http = require('http');
      bot.roomInfo(true, function(data2) {
        if (data2.room.metadata.current_song != undefined) {
          //get the current song name and artist, then replace blank spaces with underscores
          var currSong = data2.room.metadata.current_song.metadata.song;
          var currArtist = data2.room.metadata.current_song.metadata.artist;
          currSong = currSong.replace(/ /g,"_");
          currArtist = currArtist.replace(/ /g,"_");
          currSong = currSong.replace(/\./g,"");
          currArtist = currArtist.replace(/\./g,"");
          //build the api call object
          var options = {
            host: 'lyrics.wikia.com',
            port: 80,
            path: '/api.php?artist=' + currArtist + '&song=' + currSong + '&fmt=json'
          };
          //call the api
          http.get(options, function(res) {
            res.on('data', function(chunk) {
              try {
                //lyrics wiki isnt true JSON so JSON.parse chokes
                var obj = eval("(" + chunk + ')');
                //give back the lyrics. the api only gives you the first few words due to licensing
                boombot.respond(uid, obj.lyrics, private);
                //return the url to the full lyrics
                boombot.respond(uid, obj.url, private);
                console.log(obj);
              } catch (err) {
                boombot.respond(uid, err, private);
              }
            });
          }).on('error', function(e) {
            boombot.respond(uid, "Got error: " + e.message, private);
          });
        } else {
          boombot.respond(uid, 'Nothings playing....', private);
        }
      });
    }
  },
  {
    'trigger': '/rules',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, boombot.config.responses.rules, private);
    }
  },
  {
    'trigger': '/version',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, 'BOOMBOT ' + boombot.version, private);
    }
  },
  {
    'trigger': '/video',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var http = require('http');
      boombot.bot.roomInfo(true, function(data2) {
        var queryResponse = '';
        if (data2.room.metadata.current_song != undefined) {
          var currSong = data2.room.metadata.current_song.metadata.song;
          var currArtist = data2.room.metadata.current_song.metadata.artist;
          currSong = currSong.replace(/ /g,"_").replace(/#/g,"%23");
          currArtist = currArtist.replace(/ /g,"_").replace(/#/g,"%23");
          currSong = currSong.replace(/\./g,"");
          currArtist = currArtist.replace(/\./g,"");
          var options = {
            host: 'gdata.youtube.com',
            port: 80,
            path: "/feeds/api/videos?q=" + currArtist + "_" + currSong + "&max-results=1&v=2&prettyprint=true&alt=json"
          };
          http.get(options, function(response) {
            console.log("Got response:" + response.statusCode);
            response.on('data', function(chunk) {
              try {
                queryResponse += chunk;
              } catch (err) {
                boombot.respond(uid, err, private);
              }
            });
            response.on('end', function(){
              var ret = JSON.parse(queryResponse);
              //if the return is a playlist the JSON is entirely different. For now I am just error handling this.
              try {
                boombot.respond(uid, ret.feed.entry[0].media$group.media$content[0].url, private);
              } catch (err) {
                boombot.respond(uid, "Sorry. The return was a playlist. This is unsupported currently.", private);
              }
            });
          }).on('error', function(e) {
            boombot.respond(uid, "Got error: " + e.message, private);
          });
        } else {
          boombot.respond(uid, 'Nothings playing....', private);
        }
      });
    }
  }
];