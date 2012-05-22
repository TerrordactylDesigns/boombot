#BOOM BOT v1.2.3

A bot for turntable.fm
Dj, welcome users,
Call out haters, etc

##Requirements

	Node.js
	NPM
	ttapi - https://github.com/alaingilbert/Turntable-API
	ntwitter (if you want auto tweets) - https://github.com/AvianFlu/ntwitter

##Setup

once you have node running, npm,
and the ttapi installed:

Create a FB or twitter account for your new bot.
Log in as the bot and use this to get your bots uid, auth token, and your rooms id:
http://alaingilbert.github.com/Turntable-API/bookmarklet.html
Now use the same method to get your personal accounts user id for control of the bot

Open boombot.js in Sublime text 2 (Or your editor of choice... but really... go get sublime... its great..)
replace the xxxxxxxxxxxxxxxxxxxxxxxx's in the variables section with your bots auth, bot id, and your own personal user id. 
replace YourUserName with your own personal username (or whatever else you want the bot to call you) in the variables section.

Add to the arrays and/or commands anything you want to add or change. Would be nice of you to keep the url to obtain your own copy under the /boombot command, but I won't hunt you down if you want it to go.

path to the saved location,
node boombot.js

##Auto tweeting the current song

This feature is commented out by default for people who could care less about twitter. To use, read below and uncomment the twitter area at the bottom of the boombot.js file.

Create a twitter acct if you don't already have one.
Then go to dev.twitter.com and sign in with that acct and enable it for development.
Create a new twitter application. VERY IMPORTANT: BEFORE you request your Oauth tokens set the app to read + write or read + write + direct message. 
Once you have your token keys, add them to the appropriately commented areas at the bottom of the file.

The bot will now tweet the current track and artist with a #Turntablefm hashtag.


##Commands

Everyone:

* /lyrics - returns the first line of the current song and a link to the full lyrics
* /video - returns a link to a youtube search for the current song playing
* /google <search terms> returns a link to a "Let me google that for you" google search
* /hello - says hello back
* /dance - gives you a dance partner
* /boombot - information about the bot and how to acquire one
* /help - list the commands
* /rules - give the room rules
* /cheer - cheer for the song
* /boo - boo the song
* like a boss - display a random like a boss meme image
* /haters - display a random haters meme image
* meow - random super troopers meow reference
* /rich - one of the best bender quotes ever
* /chuck - random Chuck Norris joke from the icndb API
* /winning - random Charlie Sheen quote from the API
* buddy, guy, friend - say any of these in chat and be met with the appropriate line from the South Park episode.

##Administrator/"The Master":

	All commands for the master require the word boombot to trigger.
	Commands are not required to be in any order: example - This is a really good song boombot. Will trigger the 'boombot good' command.  

* djmode - make the bot get on stage and DJ

* getdown - make the bot get off stage

* skip - makes the bot skip the track it is playing

* good - remind the bot he's a good boy. Maybe he will kill you last during the robot apocalypse

* dance - make the bot upvote **this feature is not allowed and is de-activated by default**

* voodoo up - switch to the voodoo doll avatar (requires 100 dj points)

* kitten up - switch to the green kitten avatar (requires 300 dj points)

* alien up - switch to the alien avatar (requires 100 dj points)

* vampire up - switch to the vampire avatar (requires 100 dj points)

* addsong - adds the current playing song to the bots playlist

* phone up - set the bots laptop to iPhone

* fruit up - set the bots laptop to Mac

* nix up - set the bots laptop to Linux

* chrome up - sets the bots laptop to ChromeOS

##Notes

I know nothing about node. This was a playground that seemed to be liked. No warranties, no guarantees. I will however help you to the best that I can if you have any issues or find any bugs.

If you're more experienced than I am and want to tell me how to make this better in any way. I am all ears. Feel free to fork, if you come up with some cool scripts you can request a pull back and I will add them.

Lastly, ENJOY IT!!!!! It's not the best or most feature filled bot, but I appreciate you using him! 
See the original and most feature filled version of Boom Bot at [Whistle while you work](http://turntable.fm/whistle_while_you_work43) where he lives.
Come check out my personal bot [@TerrorBot](http://twitter.com/#!/terrorbot) on twitter and in [while (iCode) { drop.Beatz; } //Infinite Musik](http://turntable.fm/while_icode_dropbeatz_infinite_muzik) where he lives.