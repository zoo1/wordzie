
/**
 * Module dependencies
 */

var express = require('express'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  errorHandler = require('errorhandler'),
  cookieParser = require('cookie-parser'),
  morgan = require('morgan'),
  api = require('./routes/api'),
  http = require('http'),
  path = require('path')
  config = require('./config');

var app = module.exports = express();


/**
 * Configuration
 */

// all environments
app.set('port', config.port);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// development only
if (config.env === 'development') {
  app.use(errorHandler());
}

// production only
if (config.env === 'production') {
  // TODO
}


/**
 * Routes
 */

// serve index
app.get('/', function(req, res){ res.render('index') });

// JSON API
app.use('/api', api);

// redirect all others to the index (HTML5 history)
app.get( function(req, res){ res.render('index') });


/**
 * Start Server
 */

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
