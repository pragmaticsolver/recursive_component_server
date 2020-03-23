var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var voteSchema = new Schema({
  
  author_id: String,
  squabble_id: String,
  vote: Number

});
module.exports = mongoose.model('Squabble', squabbleSchema);