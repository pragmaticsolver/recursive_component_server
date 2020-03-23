var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
  author_id: String,
  date: Date,
  comment: String,
  comment_id: String,
  argument_id: String
});
module.exports = mongoose.model('Comment', commentSchema);