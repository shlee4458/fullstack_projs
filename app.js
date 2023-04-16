var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const catalogRouter = require('./routes/catalog');

var app = express();

// Set up mongoose connection
const mongoose = require('mongoose')
mongoose.set("strictQuery", false);
const mongoDB = "mongodb+srv://seunghanlee44:test123@cluster0.cry4loo.mongodb.net/local_library?retryWrites=true&w=majority"

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
