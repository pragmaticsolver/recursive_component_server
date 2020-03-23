var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var argumentSchema = new Schema({
    author_id: String,
    squabble_id: String,
    argument: String,
    date: Date
});
module.exports = mongoose.model('Argument', argumentSchema  );