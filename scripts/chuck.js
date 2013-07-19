/**/// Description: Return a Chuck Norris joke
/**///
/**/// Dependencies: http
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = '/chuck';
exports.listed = true;
exports.script = function(boombot, text, uname, uid, private) {
  var http = require('http');
  var options = {
    host: 'api.icndb.com',
    port: 80,
    path: '/jokes/random'
  };
  //make the API call and parse the JSON result
  http.get(options, function(res) {
    res.on('data', function(chunk) {
      var chuck = JSON.parse(chunk);
      boombot.respond(uid, chuck.value.joke, private);
    });
  }).on('error', function(e) {
    boombot.respond(uid, "Got error: " + e.message, private);
  });
}

