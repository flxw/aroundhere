'use strict';

var express  = require('express')
var app      = express()
var port     = process.env.PORT || 8080
var mongoose = require('mongoose')
var swig     = require('swig')

// connect middlewares
var morgan       = require('morgan')
var bodyParser   = require('body-parser')

// external modules
var stylus       = require('stylus')

// ----------------------------------------------

var config = require('./config.js');

// configuration --------------------------------
mongoose.connect(config.db.url)

// set up express
if (config.debug) {
  app.use(morgan('dev'))
}

// swig setup -----------------------------------
app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/views');

// Swig will cache templates for you, but you can disable
// that and use Express's caching instead, if you like:
app.set('view cache', false);
// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// NOTE: You should always cache templates in a production environment.
// Don't leave both of these to `false` in production!

// stylus setup ---------------------------------
app.use(stylus.middleware({
  src: __dirname + '/public/css',
  dest: __dirname + '/public/css',
  compile : function(str, path) {
    return stylus(str)
      .set('filename', path)
      .set('warn', true)
      .set('compress', true);
  }
}))

app.use(express.static(__dirname + '/public'))


// routing --------------------------------------
app.route('/')
  .get(function(req, res) {
    res.render('index.html')
  })


// launch ---------------------------------------
app.listen(port);
console.log('The magic happens on port ' + port);