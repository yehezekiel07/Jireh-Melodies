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

  demoVideo: String,
  learnPoints: { type: [String], default: [] },
  requirements: { type: [String], default: [] },
  previewPoints: { type: [String], default: [] },

  downloadItems: String,
  mobileAccess: Boolean,
  certificate: Boolean,

  modules: [
    {
      title: String,
      lessons: [
        {
          title: String,
          video: String,
          file: String,
          description: String,
          duration: String,
        },
      ],
    },
  ],

  status: {
    type: String,
    default: "draft",
  },
});

module.exports = mongoose.model("Course", courseSchema);
