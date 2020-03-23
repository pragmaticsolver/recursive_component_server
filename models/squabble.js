var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var squabbleSchema = new Schema({
  thesis: String,
  author_id: String,
  date: Date,
  challenger_id: String,
  status: String,
  thesis_img: String,
  anti_thesis: String,
  anti_thesis_img: String,
  expiration_date: Date,
  vote: { type: Number, default: 0 }
});



module.exports = mongoose.model('Squabble', squabbleSchema);