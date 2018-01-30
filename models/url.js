const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema({
  longurl: { type: String, required: true },
  shorturl: String
});

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;
