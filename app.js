var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

const dotenv = require("dotenv").config()
const compression = require("compression"); // add compression middleware
const helmet = require("helmet") // add protection against vulnerability
const RateLimit = require("express-rate-limit") // set up rate limit - maximum of 20 requests per minute
const limiter = RateLimit({
  windowMS: 1 * 60 * 1000, // 1 minute
  max: 20
})

var app = express();

// apply rate limit to a ll requests
app.use(limiter);

// add helmet to the middleware chain
// Set CSP headers to allow our Boostrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
    },
  })
);

// Set up mongoose connection
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const dev_db_url = `${process.env.URI}`
const mongoDB = process.env.MONGODB_URI || dev_db_url;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// load the middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(compression()); // compress all routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/catalog', catalogRouter);

// catch 404 and forward to error handler -- if none of the middleware router was called
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler -- if any of the call to the router errors
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500); // if status was set to 404 from the previous error, return that if not 500
  res.render('error');
});

module.exports = app;
