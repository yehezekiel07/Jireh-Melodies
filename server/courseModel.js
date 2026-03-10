// const mongoose = require("mongoose");

// const lessonSchema = new mongoose.Schema({
//   title: String,
//   videoUrl: String,
// });

// const moduleSchema = new mongoose.Schema({
//   title: String,
//   lessons: [lessonSchema],
// });

// const courseSchema = new mongoose.Schema({
//   title: String,
//   instructor: String,
//   language: String,
//   description: String,
//   price: Number,
//   originalPrice: Number,
//   thumbnail: String,

//   learnPoints: [String],
//   requirements: [String],
//   includes: [String],
//   cardPoints: [String],

//   modules: [moduleSchema],
// });

// module.exports = mongoose.model("Course", courseSchema);

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  instructor: String,
  language: String,
  description: String,

  price: Number,
  originalPrice: Number,

  thumbnail: String,

  learnPoints: [String], // What user will learn
  requirements: [String], // Requirements
  includes: [String], // This course includes
  previewPoints: [String], // Card preview points

  modules: Array,

  status: {
    type: String,
    default: "draft",
  },
});

module.exports = mongoose.model("Course", courseSchema);
