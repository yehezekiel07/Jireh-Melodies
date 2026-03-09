const mongoose = require("mongoose");

const moduleSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
});

const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  language: String,
  description: String,
  price: Number,
  originalPrice: Number,

  learnPoints: [String],
  requirements: [String],
  includes: [String],
  coursePreview: [String],

  modules: [moduleSchema],
});

module.exports = mongoose.model("Course", courseSchema);
