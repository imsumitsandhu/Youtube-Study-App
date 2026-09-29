require("dotenv").config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
const session = require("express-session");
const { MongoStore } = require("connect-mongo");
const mongoose = require("mongoose");

const { requireAuth } = require('./middleware/auth');
const youtubeRouter = require("./routes/youtube");
const historyRouter = require('./routes/history');
var indexRouter = require('./routes/index');

var app = express();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// session MUST come before every router
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 },
}));

// makes `isLoggedIn` available in every EJS view
app.use((req, res, next) => {
  res.locals.isLoggedIn = !!req.session.userId;
  next();
});

// routers (all AFTER session)
app.use('/', indexRouter);
app.use('/', historyRouter);
app.use('/youtube', requireAuth, youtubeRouter); // login required

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;