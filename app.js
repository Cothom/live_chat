var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var messagesModel = require('./models/messages');

var index = require('./routes/index');
var users = require('./routes/users');

var port = 8080;
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({secret: 'thisistopsecret', saveUninitialized: true, resave: true}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//app.listen(port);
var io = require('socket.io').listen(app.listen(port));
io.sockets.on('connection', function(socket) {
    socket.emit('message', { message: 'Welcome to E-Mothep !'});
    socket.on('sendmessage', function(data) {
        io.sockets.emit('message', data);

        var db = new messagesModel();
        db.msgDate = data.date;
        db.msgAuthor = data.author;
        db.msgContent = data.content;
        console.log('app.js:on(sendmessage) -> ' + data.date + ' ' + data.author + ' ' + data.content);
        db.save(function(err) {
            if (err) {
                console.log('app.js:addMessage.save -> Error adding data');
            } else {
                console.log('app.js:addMessage.save -> Data added');
            }
        });
    })
});
module.exports = app;
