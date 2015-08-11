var request = require('request');
var config = require('../config');
var myshort = require('../lib/mysqlshort');

exports.lookupword = function (req, res) {
	var word =req.params.word;
	var connection = myshort();
	connection.query("SELECT * FROM words where word='" + word + "'", function(err, rows, fields) {
  	if (err) throw err;
  	if(rows.length==0) wordmiss(word, res);
  	else
  	{
  		res.json(JSON.parse(rows[0].json));
  	}
});

connection.end();
};

function wordmiss(word, res)
{
	request('http://api.wordnik.com:80/v4/word.json/' + word + '/definitions?limit=4&api_key=' + config.wordnikkey, function (error, response, body) {
  	  body = JSON.parse(body);
  	  if ( error || response.statusCode != 200)
  	  	res.json({ error: 'Error fetching data'});
  	  else if( body.length == 0 )
  	  	res.json({ error: 'invalid word'});
  	  else
  	  {
  	  	var words = [];
  	  	for(var i = 0;i < body.length; i++)
  	  	{
  	  		var entry = {}
  	  		entry.def = body[i].text;
  	  		entry.partofspeech = body[i].partOfSpeech;
  	  		words.push(entry);
  	  	}
  	  	res.json(words);
  	  	words = JSON.stringify(words);
  	  	var connection = myshort();
  	  	connection.query("INSERT INTO words values ( NULL, '"+ word +"', '" + words + "')",function(err) { });
  	  	connection.end();
  	  }
});
}
 //return word of the day remember to do basic caching
exports.wordoftheday = function (req, res) {
	var connection = myshort();
	connection.query("SELECT * FROM stats where stat='lastdate' AND value=CURDATE()", function(err, rows, fields) {
  	if (err) throw err;
  	if(rows.length==0) daywordmiss(res);
  	else
  	{
  		var connection = myshort();
  		connection.query("SELECT * from words,stats where stats.value=words.word and stats.stat='wordofday'", function(err, rows, fields) {
  	if (err) throw err;

  	res.json({word: rows[0].word, defs: JSON.parse(rows[0].json)});
  });
  		connection.end();
  	}

});
	connection.end();
};

function daywordmiss(res)
{
	request('http://api.wordnik.com:80/v4/words.json/wordOfTheDay?api_key=' + config.wordnikkey, function (error, response, body) {
		if ( error || response.statusCode != 200)
  	  		res.json({ error: 'Error fetching data'});
  	  	else
  	  	{
  	  		body = JSON.parse(body);
  	  		var word = body.word;
  	  		var words = [];
  	  		for(var i=0;i<body.definitions.length;i++)
  	  		{
  	  			var entry = {};
  	  			entry.def = body.definitions[i].text;
  	  			entry.partofspeech = body.definitions[i].partOfSpeech;
  	  			words.push(entry);
  	  		}
  	  		res.json({word: word, words: words});
  	  		words = JSON.stringify(words);
  	  		var connection = myshort();
  	  		connection.query("INSERT INTO words values ( NULL, '"+ word +"', '" + words + "')",function(err) { });
  	  		connection.query("UPDATE stats SET value=CURDATE() WHERE stat='lastdate'", function(err) { });
  	  		connection.query("UPDATE stats SET value='" + word + "' WHERE stat='wordofday'", function(err) { });
  	  	}
	});
}

//return list of words and definitions for a specific user
exports.userlist = function (req, res) {
  res.json({
    name: 'Bob'
  });
};