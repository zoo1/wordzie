/*
 * Serve JSON to our AngularJS client
 */

 //return word of the day remember to do basic caching
exports.wordoftheday = function (req, res) {
  res.json({
    name: 'Bob'
  });
};

//return list of words and definitions for a specific user
exports.userlist = function (req, res) {
  res.json({
    name: 'Bob'
  });
};