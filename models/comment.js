const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  username: { type: String, maxlength: 25, required: true },
  text: { type: String, required: true },
  postId: { type: String, required: true },
  date: { type: Date, default: new Date() },
});

module.exports = mongoose.model("Comment", CommentSchema);
