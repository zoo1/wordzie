
module.exports = function(){
var mysql = require('mysql');
var config = require("../config");
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : config.msqluser,
  password : config.msqlpass,
  database : 'wordzie'
});
return connection;
};