// server.js

var express = require('express');
var app = express();
var http = require('http').Server(app);     
var path = require('path');
var session = require('express-session');

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'sid',
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24000 * 60 * 60 // 쿠키 유효기간 24시간
  }
}));

var indexRouter = require('./routes/index');
var userRouter = require('./routes/users');
var studyRouter = require('./routes/study');

app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/study', studyRouter);


http.listen(3000, function(){ 
	console.log('server on..');
});