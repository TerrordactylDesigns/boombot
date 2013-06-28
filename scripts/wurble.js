/**/// Description: return a random like a boss image
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = 'like a boss';
exports.listed = true;
exports.script = function(boombot, text, uname, uid, private) {
  //like a boss array
  var bossList = [
    "http://goo.gl/R2Abr",
    "http://goo.gl/OWVEY",
    "http://goo.gl/4mB62",
    "http://goo.gl/5IsZp",
    "http://goo.gl/uEddI",
    "http://goo.gl/Z7eFQ",
    "http://goo.gl/F0dFs",
    "http://goo.gl/bkFKL",
    "http://goo.gl/KRlQr"
  ];
  var rndm = Math.floor(Math.random() * 9);
  boombot.respond(uid, bossList[rndm], private);
}

