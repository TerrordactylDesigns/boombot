/**/// Public: Blacklist
/**///
/**/// Args
/**/// user     - the users DJ object
/**/// modName  - the moderator who banned
/**///
/**/// Returns
/**/// return   - a Blacklist object for banned users
var BlackList = function(user, modName) {
  this.user     = user
  this.modName  = modName
  var today     = new Date()
  this.date     = (today.getMonth() + 1) + '/' + today.getDate() + '/' + today.getFullYear()
}

module.exports = BlackList
