let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
let cors = require("cors");
const mongoose = require("mongoose");
require('dotenv').config();

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
let gamesRouter = require("./routes/game")

let app = express();

mongoose.connect(`mongodb+srv://matryt:${process.env.MONGODB_PASSWORD}@cluster1.ru2wdaz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1`)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch((e) => console.log(e.message));

// view engine setup

 
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/games", gamesRouter);

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
