/**/// Description: A list of penis related funnies
/**///
/**/// Dependencies: None
/**///
/**/// Author: https://github.com/allusis
/**///
/**/// Notes: None
exports.trigger = 'penis';
exports.listed = false;
exports.script = function(boombot, text, uname, uid, private) {
  var penisList = [
    "http://goo.gl/S3DpO", 
    "That awkward moment when your friends facebook wasnt hacked, he just really loves penis.",
    "Dammit Beavis, what the hell are you doing? You're not supposed to have your penis out while you're cooking!",
    "http://goo.gl/z6e2X",
    "My girlfriend caught me blow drying my penis...She asked what was I doing. Apparently, 'heating up your dinner' wasn't a sexy answer.",
    "Women are from stars, men are from penis.",
    "There was a man from Peru, who fell asleep in his canoe. He was dreaming of Venus holding his penis and he woke up with a handful of goo.",
    "I once made love to a female clown, and she twisted my penis into a poodle.",
    "I nicknamed my penis 'The Truth' because bitches can't handle it.",
    "Wanna hear a joke about my penis? Never mind, it's too long.",
    "Shut the fuck up... No one gives fucks!",
    "What the fuck?"
  ];
  var rndm = Math.floor(Math.random() * 12);
  boombot.respond(uid, penisList[rndm], private);
}

