var mysql = require('mysql');
var config = require("./config");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : config.msqluser,
  password : config.msqlpass,
  database : 'wordzie'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }});

connection.query("DROP TABLE words", function(err) { });
connection.query("DROP TABLE lists", function(err) { });
connection.query("DROP TABLE stats", function(err) { });

connection.query("CREATE TABLE words (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, word VARCHAR(30) NOT NULL, json VARCHAR(1000) NOT NULL)" 
,function(err) { });
connection.query("CREATE TABLE lists ( listid INT UNSIGNED, wordid INT NOT NULL)" 
,function(err) { });
connection.query("CREATE TABLE stats ( stat VARCHAR(30), value VARCHAR(1000))" 
,function(err) { });


connection.query("INSERT INTO stats values ('lastdate', '1970-11-11')",function(err) { }); //insert old date so new word will be fetched
connection.query("INSERT INTO stats values ('wordofday', '')",function(err) { });
connection.end();
