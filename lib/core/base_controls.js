/**/// Public: Core scripts for users
/**///
/**/// Returns
/**/// return - array of core commands and functionality for the bot
var config = require('../../config.json')
module.exports = [
  {
    'trigger': '/boombot',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, 'BOOM BOT ' + boombot.version + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/boombot', private)
    }
  },
  {
    'trigger': '/help',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var response = 'My current commands are: ' + boombot.commands.filter(function(command) {
        return command.listed
      }).map(function(command){
        return command.trigger
      }).sort().join(', ')
      boombot.respond(uid, response, private)
    }
  },
  {
    'trigger': '/album',
    'listed': config.lastfm.use,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
        bot.roomInfo(true, function(data2) {
          if (data2.room.metadata.current_song != undefined) {
            //get the current artist, then replace blank spaces with underscores
            var currArtist    = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'+').replace(/\./g,'')
              , currSong      = data2.room.metadata.current_song.metadata.song.replace(/ /g,'+').replace(/\./g,'')
              , queryResponse = ''
              , apiCall       = {
                                  host: 'ws.audioscrobbler.com',
                                  port: 80,
                                  path: '/2.0/?method=track.getInfo&artist=' + currArtist + '&api_key=' + boombot.config.lastfm.API_key + '&track=' + currSong + '&format=json'
                                }
            //call the api
            http.get(apiCall, function(res) {
              res.on('data', function(chunk) {
                try {
                  queryResponse += chunk
                } catch (err) {
                  boombot.respond(uid, err, private)
                }
              })
              res.on('end', function(){
                //if the return is a playlist the JSON is entirely different. For now I am just error handling this.
                try {
                  var ret = JSON.parse(queryResponse)
                  boombot.respond(uid, ret.track.album.title, private)
                } catch (err) {
                  boombot.respond(uid, 'Sorry, Last.fm had no matching result.', private)
                }
              })
            }).on('error', function(e) {
              boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
            })
          }
        })
      }
    }
  },
  {
    'trigger': '/artistinfo',
    'listed': config.lastfm.use,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
        bot.roomInfo(true, function(data2) {
          if (data2.room.metadata.current_song != undefined) {
            //get the current artist, then replace blank spaces with underscores
            var currArtist    = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'+').replace(/\./g,'')
              , queryResponse = ''
              , apiCall       = {
                                  host: 'ws.audioscrobbler.com',
                                  port: 80,
                                  path: '/2.0/?method=artist.getInfo&artist=' + currArtist + '&api_key=' + boombot.config.lastfm.API_key + '&format=json'
                                }
            //call the api
            http.get(apiCall, function(res) {
              res.on('data', function(chunk) {
                try {
                  queryResponse += chunk
                } catch (err) {
                  boombot.respond(uid, err, private)
                }
              })
              res.on('end', function(){
                try {
                  var ret = JSON.parse(queryResponse)
                  boombot.respond(uid, ret.artist.bio.summary, private)
                } catch (err) {
                  boombot.respond(uid, 'Sorry, Last.fm had no matching result.', private)
                }
              })
            }).on('error', function(e) {
              boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
            })
          }
        })
      }
    }
  },
  {
    'trigger': '/similarartists',
    'listed': config.lastfm.use,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
        bot.roomInfo(true, function(data2) {
          if (data2.room.metadata.current_song != undefined) {
            //get the current artist, then replace blank spaces with underscores
            var currArtist    = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'+').replace(/\./g,'')
              , queryResponse = ''
              , apiCall       = {
                                  host: 'ws.audioscrobbler.com',
                                  port: 80,
                                  path: '/2.0/?method=artist.getSimilar&artist=' + currArtist + '&api_key=' + boombot.config.lastfm.API_key + '&format=json&limit=3'
                                }
            //call the api
            http.get(apiCall, function(res) {
              res.on('data', function(chunk) {
                try {
                  queryResponse += chunk
                } catch (err) {
                  boombot.respond(uid, err, private)
                }
              })
              res.on('end', function(){
                try {
                  var ret     = JSON.parse(queryResponse)
                    , artist  = ret.similarartists.artist
                    , list    = ''
                  for (var i=0;i<artist.length;i++) {
                    list += artist[i].name
                    list = (i == artist.length - 1) ? list += '.' : list += ','
                  }
                  boombot.respond(uid, 'Artists similar to ' + currArtist.replace(/\+/g,' ') + ': ' + list, private)
                } catch (err) {
                  boombot.respond(uid, 'Sorry, Last.fm had no matching result.', private)
                }
              })
            }).on('error', function(e) {
              boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
            })
          }
        })
      }
    }
  },
  {
    'trigger': '/similarsongs',
    'listed': config.lastfm.use,
    'script': function(boombot, text, uname, uid, private) {
      if (boombot.config.lastfm.use) {
        var http = require('http')
        bot.roomInfo(true, function(data2) {
          if (data2.room.metadata.current_song != undefined) {
            //get the current artist, then replace blank spaces with underscores
            var currArtist    = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'+').replace(/\./g,'')
              , currSong      = data2.room.metadata.current_song.metadata.song.replace(/ /g,'+').replace(/\./g,'')
              , queryResponse = ''
              , apiCall       = {
                                  host: 'ws.audioscrobbler.com',
                                  port: 80,
                                  path: '/2.0/?method=track.getSimilar&artist=' + currArtist + '&track=' + currSong + '&api_key=' + boombot.config.lastfm.API_key + '&format=json&limit=3'
                                }
            //call the api
            http.get(apiCall, function(res) {
              res.on('data', function(chunk) {
                try {
                  queryResponse += chunk
                } catch (err) {
                  boombot.respond(uid, err, private)
                }
              })
              res.on('end', function(){
                try {
                  var ret   = JSON.parse(queryResponse)
                    , list  = ''
                    , songs = ret.similartracks.track
                  for (var i=0;i<songs.length;i++) {
                    list += songs[i].name + ' By: ' + songs[i].artist.name
                    list = (i == songs.length - 1) ? list += '.' : list += ','
                  }
                  boombot.respond(uid, 'Songs similar to ' + currSong.replace(/\+/g,' ') + ': ' + list, private)
                } catch (err) {
                  boombot.respond(uid, 'Sorry, Last.fm had no matching result.', private)
                }
              })
            }).on('error', function(e) {
              boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
            })
          }
        })
      }
    }
  },
  {
    'trigger': '/lyrics',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var http = require('http')
      bot.roomInfo(true, function(data2) {
        if (data2.room.metadata.current_song != undefined) {
          //get the current song name and artist, then replace blank spaces with underscores
          var currSong    = data2.room.metadata.current_song.metadata.song.replace(/ /g,'_').replace(/\./g,'')
            , currArtist  = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'_').replace(/\./g,'')
            , apiCall     = {
                              host: 'lyrics.wikia.com',
                              port: 80,
                              path: '/api.php?artist=' + currArtist + '&song=' + currSong + '&fmt=json'
                            }
          //call the api
          http.get(apiCall, function(res) {
            res.on('data', function(chunk) {
              try {
                //lyrics wiki isnt true JSON so JSON.parse chokes
                var obj = eval('(' + chunk + ')')
                //give back the lyrics. the api only gives you the first few words due to licensing
                boombot.respond(uid, obj.lyrics, private)
                //return the url to the full lyrics
                boombot.respond(uid, obj.url, private)
              } catch (err) {
                boombot.respond(uid, err, private)
              }
            })
          }).on('error', function(e) {
            boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
          })
        } else {
          boombot.respond(uid, 'Nothings playing....', private)
        }
      })
    }
  },
  {
    'trigger': '/rules',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, boombot.config.responses.rules, private)
    }
  },
  {
    'trigger': '/version',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, 'BOOMBOT ' + boombot.version, private)
    }
  },
  {
    'trigger': '/video',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      var http = require('http')
      boombot.bot.roomInfo(true, function(data2) {
        var queryResponse = ''
        if (data2.room.metadata.current_song != undefined) {
          var currSong    = data2.room.metadata.current_song.metadata.song.replace(/ /g,'_').replace(/#/g,'%23').replace(/\./g,'')
            , currArtist  = data2.room.metadata.current_song.metadata.artist.replace(/ /g,'_').replace(/#/g,'%23').replace(/\./g,'')
            , apiCall     = {
                              host: 'gdata.youtube.com',
                              port: 80,
                              path: '/feeds/api/videos?q=' + currArtist + '_' + currSong + '&max-results=1&v=2&prettyprint=true&alt=json'
                            }
          http.get(apiCall, function(response) {
            response.on('data', function(chunk) {
              try {
                queryResponse += chunk
              } catch (err) {
                boombot.respond(uid, err, private)
              }
            })
            response.on('end', function(){
              var ret = JSON.parse(queryResponse)
              //if the return is a playlist the JSON is entirely different. For now I am just error handling this.
              try {
                boombot.respond(uid, ret.feed.entry[0].media$group.media$content[0].url, private)
              } catch (err) {
                boombot.respond(uid, 'Sorry. The return was a playlist. This is unsupported currently.', private)
              }
            })
          }).on('error', function(e) {
            boombot.respond(uid, '[ ERROR ]: ' + e.message, private)
          })
        } else {
          boombot.respond(uid, 'Nothings playing....', private)
        }
      })
    }
  }
]