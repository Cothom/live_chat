var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var messages = getMessages();

function authIsValid(user, passwd) {
    if (user == "thomas" && passwd == "thomas" ||
        user == "marc" && passwd == "marc" ||
        user == "val" && passwd == "val")
        return true;
    else
        return false;
}

function getMessages() {
    return [ {'date': '01/01/1970 00:00', 'author': 'Unknown', 'content': 'Hello ! The conversation begins here !'}];
}

function loadMessages(req) {
    req.session.messages = messages;
}

/* GET home page. */
router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express', session: req.session});
    });
router.post('/', urlencodedParser, function(req, res, next) {
        var user = req.body.username;
        var passwd = req.body.password;
        if (authIsValid(user, passwd)) {
            req.session.username = user;
            req.session.loggedIn = true;
            loadMessages(req);
            res.render('index', {title: 'Express', session: req.session});
        } else {
            req.session.loggedIn = false;
            res.render('index', {title: 'Express', session: req.session});
        }
    });
router.post('/sendmessage', urlencodedParser, function(req, res, next) {
    messages.push({'date': 'Unknown date', 'author': req.session.username, 'content': req.body.message});
    req.session.messages = messages;
    res.redirect('/');
});

module.exports = router;
