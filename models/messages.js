var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/projet_blanc');
var mongoSchema = mongoose.Schema;
var msgSchema = {
    'msgDate': String,
    'msgAuthor': String,
    'msgContent': String
};
module.exports = mongoose.model('messages', msgSchema);
