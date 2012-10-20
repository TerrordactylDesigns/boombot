/**/// Public: array of commands for room admins/moderators
/**///
/**/// Returns
/**/// trigger - the command trigger
/**/// script - function to run when triggered. REQUIRES an instance of a bot as the arg.
module.exports = [
  {
    trigger: '/q on',
    script: function(boombot) {
      boombot.queue = true;
      boombot.bot.speak('Alright ladies and gents. Get in line, watch your step, no shirts or pants allowed.');
    }
  },
  {
    trigger: '/q off',
    script: function(boombot) {
      boombot.queue = false;
      boombot.djQueue = [];
      boombot.bot.speak('FREE FOR ALL! THIS IS MADNESS! THIS IS SPARTA!');
    }
  },
  {
    trigger: '/1',
    script: function(boombot) {
      boombot.queueLength = 1;
      boombot.bot.speak("One song then GTFO the decks....");
    }
  },
  {
    trigger: '/2',
    script: function(boombot) {
      boombot.queueLength = 2;
      boombot.bot.speak("Two songs then GTFO the decks....");
    }
  },
  {
    trigger: '/3',
    script: function(boombot) {
      boombot.queueLength = 3;
      boombot.bot.speak("Three song then GTFO the decks....");
    }
  },
  {
    trigger: '/none',
    script: function(boombot) {
      boombot.queueLength = 100;
      boombot.bot.speak("No limit to songs....");
    }
  }
];