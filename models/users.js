var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/projet_blanc');
var mongoSchema = mongoose.Schema;
var userSchema = {
    'userName': String,
    'userPassword': String
};
module.exports = mongoose.model('users', userSchema);