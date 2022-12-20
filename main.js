var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
const passport = require('passport');


var indexRouter = require('./routes/index');

var app = express();

// passport
app.use(passport.initialize());
require('./auth');

app.set('trust proxy', 1)
app.use(session({
  secret: '12345',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: true
 }
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const db = require('./models');
const { LoginRoute } = require('./login/Route');
const { RegisterRoute } = require('./register/route');
const { refreshRoute } = require('./refreshToken/route');

db.sequelize.sync()
.then(()=> {
    console.log("async db");
})
.catch((err)=> {
    console.log("error: "+ err.message);
})

// app.use('/', indexRouter);
app.post("/login", LoginRoute);
app.post("/register", RegisterRoute);
app.post("/refresh", refreshRoute);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
