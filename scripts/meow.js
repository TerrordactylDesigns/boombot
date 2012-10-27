/**/// Description: Listens for the word meow and returns a random Super Troopers meow quote
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/TerrordactylDesigns
/**///
/**/// Notes: None
exports.trigger = 'meow';
exports.listed = true;
exports.script = function(boombot, text, uname, uid, private) {
  //meow array
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
  var rndm = Math.floor(Math.random() * 10);
  boombot.respond(uid, meowList[rndm], private);
}