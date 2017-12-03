var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function authIsValid(user, passwd) {
    if (user == "thomas" && passwd == "thomas")
        return true;
    else
        return false;
}

/* GET home page. */
router.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });
router.post('/', urlencodedParser, function(req, res, next) {
        var user = req.body.username;
        var passwd = req.body.password;
        if (authIsValid(user, passwd)) {
            res.render('index', {title: 'Express', authorized: true});
        } else {
            res.render('index', {title: 'Express', authorized: false});
        }
    });

module.exports = router;
