module.exports = [
  {
    'trigger': '/boombot',
    'listed': true,
    'script': function(boombot, text, uname, uid, private) {
      boombot.respond(uid, 'BOOM BOT ' + boombot.version + ' \n\r Coded by: http://GPlus.to/TerrordactylDesigns/ \n\r Acquire your own at https://github.com/TerrordactylDesigns/boombot', private)
    }
  }
]