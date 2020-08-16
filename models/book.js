const mongoose = require("mongoose");
const { ObjectId } = mongoose;
const Schema = mongoose.Schema;
const Author = require("./author");

const bookSchema = new Schema({
  title: String,
  authorId: ObjectId,
});

module.exports = mongoose.model("Book", bookSchema);
