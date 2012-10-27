/**/// Description: Say hello to the bot
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = '/hello';
exports.listed = true;
exports.script = function(boombot, text, uname, uid, private) {
  boombot.respond(uid, 'Hai '+data.name+'!', private);
}