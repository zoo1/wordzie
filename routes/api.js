var request = require('request');
var express = require('express');
var crypto = require('crypto');

var config = require('../config');
var myshort = require('../lib/mysqlshort');

var router = express.Router();

router.get( '/word/:word', function (req, res, next) {
	var word =req.params.word;
  if(!word) {
    res.json({ error: "undefinded word"});
    return;
  }
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
});

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
router.get('/day', function (req, res) {
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
});

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
  	  		res.json({word: word, defs: words});
  	  		words = JSON.stringify(words);
  	  		var connection = myshort();
  	  		connection.query("INSERT INTO words values ( NULL, '"+ word +"', '" + words + "')",function(err) { });
  	  		connection.query("UPDATE stats SET value=CURDATE() WHERE stat='lastdate'", function(err) { });
  	  		connection.query("UPDATE stats SET value='" + word + "' WHERE stat='wordofday'", function(err) { });
  	  	}
	});
}

//return list of words and definitions for a specific user
router.get('/list', function (req, res) {
  if(req.cookies.id)
  {
    var id = req.cookies.id;
    var connection = myshort();
    var ret = [];
    connection.query("SELECT * FROM lists,words where lists.listid='" + id + "' AND words.id = lists.wordid", function(err, rows, fields) {
      for(var i=0; i<rows.length;i++)
      {
        var entry = { word: rows[i].word, defs: JSON.parse(rows[i].json)}
        ret.push(entry);
      }
      res.json(ret);
    });
  }
  else
  {
    var connection = myshort();
    function findid( connection ) {
      var id = crypto.randomBytes(20).toString('hex');
      connection.query("SELECT * FROM lists where listid='" + id + "'", function(err, rows, fields) {
        console.log("yes");
        if(rows.length == 0)
        {
          res.cookie('id', id, { maxAge:  2147483647 });
          res.json([]);
          connection.end();
        }
        else
        {
          findid(connection);
        }
      });
    };
    findid(connection);
  }
});

//append word to beginning of list
router.post('/list', function (req, res){
  if(!req.cookies.id)
    res.json({ error : "List identifier not found in request"});
  else if(!req.body.word)
    res.json({ error : "Word not found in request"});
  else
  {
    var id = req.cookies.id;
    var word = req.body.word;
    var connection = myshort();
    connection.query("SELECT * from words where word ='" + word + "'", function(err, rows, fields) {
      var wordid =rows[0].id;
      connection.query("INSERT INTO lists values ('" + id + "', '" + wordid +"')", function(err, rows, fields) {
        connection.end();
        res.json({ success: "word added to your list"});
    });
  });
  }
});

//catchall of api
router.use(function (req, res){
  res.status(404).json( {error: "404: resource not found"} );
});

module.exports = router;