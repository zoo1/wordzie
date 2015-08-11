var request = require('request');
var config = require('../config');

exports.lookupword = function (req, res) {
	var word =req.params.word;
	request('http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=4&api_key=' + config.wordnikkey, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body) // Show the HTML for the Google homepage.
  }
});
};
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