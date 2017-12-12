var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var messagesModel = require('../models/messages');
var usersModel = require('../models/users');
var EventEmitter = require('events').EventEmitter;

var authEvents = new EventEmitter();
authEvents.on('authIsValid', function (req, res, isValid) {
    if (isValid) {
        req.session.username = req.body.username;
        req.session.loggedIn = true;
        getMessages(req, res);
    } else {
        req.session.loggedIn = false;
        res.render('index', {title: 'Express', session: req.session});
    }
});

var msgEvents = new EventEmitter();
msgEvents.on('gotMessages', function (req, res, data) {
    if (req.session.messages == undefined) req.session.messages = [];
    for (var i = 0; i < data.length; i++) {
        var message = {'date': data[i].msgDate, 'author': data[i].msgAuthor, 'content': data[i].msgContent};
        req.session.messages.push(message);
        console.log('index.js:on(gotMessages) -> Message loaded : ' + message.date + message.author + message.content);
    }
    res.render('index', {title: 'Express', session: req.session});
});

function hashPasswd(passwd) {
    return require('crypto').createHash('sha1').update(passwd).digest('base64');
}

function authIsValid(user, passwd, req, res) {
    var goodPasswd = "";
    usersModel.findOne({'userName' : user}, function (err, data) {
        if (err) throw err;
        goodPasswd = data.userPassword;
        authEvents.emit('authIsValid', req, res, hashPasswd(passwd) === goodPasswd);
    });
}

function addUser(user, passwd) {
    var db = new usersModel();
    var res = {};
    db.userName = user;
    db.userPassword = hashPasswd(passwd);
    db.save(function(err) {
        if (err) {
            res = {'err' : true, 'message': 'Error adding data'};
            console.log('index.js:addUser.save -> Error : ' + res['message']);
        } else {
            res = {'err': false, 'message': 'Data added'};
            console.log('index.js:addUser.save -> ' + res['message']);
        }
    });
}

function getMessages(req, res) {
    messagesModel.find({}, function (err, data) {
        if (err) throw err;
        msgEvents.emit('gotMessages', req, res, data);
    });
}

router.get('/', function (req, res, next) {
        if (req.session.loggedIn && req.session.messages == undefined) {
            getMessages(req, res);
        } else {
            res.render('index', {title: 'Express', session: req.session});
        }
});
router.post('/connect', urlencodedParser, function(req, res, next) {
        var user = req.body.username;
        var passwd = req.body.password;
        authIsValid(user, passwd, req, res);
});
router.post('/registrate', urlencodedParser, function(req, res, next) {
    var user = req.body.username;
    var passwd1 = req.body.password1;
    var passwd2 = req.body.password2;
    if (passwd1.length > 1 && passwd1 == passwd2) {
        console.log('index.js:post("/registrate") -> passwords are equal');
        addUser(user, passwd1);
        req.session.username = user;
        req.session.loggedIn = true;
        getMessages(req, res);
    } else {
        req.session.loggedIn = false;
        res.render('index', {title: 'Express', session: req.session});
    }
});
/*router.post('/sendmessage', urlencodedParser, function(req, res, next) {
    var message = req.body.message;
    messages.push({'date': message.date, 'author': req.session.username, 'content': message.content});
    addMessage(message.date, req.session.username, message.content);
    req.session.messages = messages;
    res.redirect('/');
});*/

module.exports = router;
