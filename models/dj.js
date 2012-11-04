/**/// Public: DJ object class
/**///
/**/// Args
/**/// name   - Dj name
/**/// userid - Dj user id
/**///
/**/// Returns
/**/// return - A Dj object for queue and event processing
var DJ = function(name, userid) {
  this.name   = name
  this.userid = userid
  this.plays  = 0
}
/**/// Public: Set Dj play count to 0
/**///
/**/// Returns
/**/// return - plays = 0
DJ.prototype.ClearPlays = function() {
  this.plays = 0
}
/**/// Public: Increment Dj play count
/**///
/**/// Returns
/**/// return - plays + 1
DJ.prototype.IncPlays = function() {
  this.plays += 1
}

module.exports = DJ