/**/// Description: Say hello to the bot
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = '/hello';
exports.listed = true;
exports.script = function(boombot, data) {
  boombot.bot.speak('Hai '+data.name+'!');
}