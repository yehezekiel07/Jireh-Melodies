const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./userModel");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(
    "mongodb://jireh_admin:JirehMelodies@ac-lw6clf7-shard-00-00.wni3hr0.mongodb.net:27017,ac-lw6clf7-shard-00-01.wni3hr0.mongodb.net:27017,ac-lw6clf7-shard-00-02.wni3hr0.mongodb.net:27017/jireh?ssl=true&replicaSet=atlas-12kqdc-shard-0&authSource=admin&appName=Cluster0",
  )
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Admin Login

app.get("/create-admin", async (req, res) => {
  const admin = new User({
    fullname: "Admin",
    phone: "0000000000",
    email: "admin@jireh.com",
    username: "admin",
    password: "admin123",
    role: "admin",
  });

  await admin.save();

  res.send("Admin created successfully");
});

// Checking whether is user is ADMIN or USER

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, password });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    res.json({
      success: true,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Generate Password Functionality

app.post("/generate-credentials", (req, res) => {
  const { fullname, phone, email } = req.body;

  const namePart = fullname.replace(/\s+/g, "").toLowerCase().slice(0, 4);

  const phonePart = phone.slice(-3);

  const specialChars = ["@", "#", "$", "!"];
  const symbol = specialChars[Math.floor(Math.random() * specialChars.length)];

  const password = namePart + symbol + phonePart;

  // Username different from password
  const emailPart = email.split("@")[0].slice(0, 3).toLowerCase();

  const username = emailPart + phone.slice(-4);

  res.json({
    username,
    password,
  });
});

// Saving the User Functionality

app.post("/add-user", async (req, res) => {
  const { fullname, phone, email, username, password } = req.body;

  try {
    const user = new User({
      fullname,
      phone,
      email,
      username,
      password,
      role: "user",
    });

    await user.save();

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error creating user",
    });
  }
});

// All Users Table Functionality

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get a User Data

app.get("/user/:id", async (req, res) => {
  try {
    if (!req.params.id || req.params.id === "null") {
      return res.json(null);
    }

    const user = await User.findById(req.params.id);

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User

app.delete("/delete-user/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// Update User

app.put("/update-user/:id", async (req, res) => {
  const { fullname, phone, email, username, password } = req.body;

  await User.findByIdAndUpdate(req.params.id, {
    fullname,
    phone,
    email,
    username,
    password,
  });

  res.json({ success: true });
});

// Course Related Code //

const Course = require("./courseModel");

// Creating a Course

app.post("/create-course", async (req, res) => {
  const course = new Course(req.body);

  await course.save();

  res.json({ success: true });
});

// Get All Courses

app.get("/courses", async (req, res) => {
  const courses = await Course.find();

  res.json(courses);
});

// Get Single Course

app.get("/course/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);

  res.json(course);
});

// Image Compression in Backend

const multer = require("multer");
const sharp = require("sharp");
const path = require("path");

app.use(express.static("public"));

/* Multer setup (store file in memory) */
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/* Image Upload API */
app.post("/upload-image", upload.single("image"), async (req, res) => {
  try {
    const filename = Date.now() + ".webp";

    await sharp(req.file.buffer)
      .resize(800) // resize width
      .webp({ quality: 80 }) // compress
      .toFile("uploads/" + filename);

    res.json({
      message: "Image uploaded successfully",
      file: filename,
    });
  } catch (error) {
    res.status(500).json({
      message: "Upload failed",
    });
  }
});

// Save Course Step-1

app.post("/create-course-draft", upload.single("image"), async (req, res) => {
  try {
    const course = new Course({
      title: req.body.title,
      instructor: req.body.instructor,
      language: req.body.language,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice,
      thumbnail: req.body.thumbnailName || null,
      status: "draft",
    });

    console.log("Uploaded file:", req.file);

    await course.save();

    res.json({
      success: true,
      courseId: course._id,
    });
  } catch (error) {
    console.error("Error creating course:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create course draft",
    });
  }
});

// Draft Course Step-1 (when clicking back)

app.get("/get-course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update Data for Step-1

app.put(
  "/update-course-basic/:id",
  upload.single("image"),
  async (req, res) => {
    try {
      const updateData = {
        title: req.body.title,
        instructor: req.body.instructor,
        language: req.body.language,
        description: req.body.description,
        price: req.body.price,
        originalPrice: req.body.originalPrice,
      };

      if (req.body.thumbnailName) {
        updateData.thumbnail = req.body.thumbnailName;
      }

      await Course.findByIdAndUpdate(req.params.id, updateData);

      res.json({ success: true });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  },
);

// Update Course Step-2 Details

app.put("/update-course-details/:id", async (req, res) => {
  try {
    await Course.findByIdAndUpdate(req.params.id, {
      learnPoints: req.body.learnPoints,
      requirements: req.body.requirements,
      previewPoints: req.body.previewPoints,
      duration: req.body.duration,
      downloadItems: req.body.downloadItems,
      mobileAccess: req.body.mobileAccess,
      certificate: req.body.certificate,
    });

    res.json({ success: true });
  } catch (error) {
    console.error("Error updating course details:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Upload Document Route

const fs = require("fs");

app.post("/upload-document", upload.single("document"), async (req, res) => {
  try {
    const filename = Date.now() + path.extname(req.file.originalname);

    await fs.promises.writeFile("uploads/" + filename, req.file.buffer);

    res.json({
      success: true,
      file: filename,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
});

// ===========================
// GET MODULES
// ===========================

app.get("/get-modules/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.json({ success: false });
    }

    res.json({
      success: true,
      modules: course.modules || [],
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

// ===========================
// SAVE MODULES
// ===========================

app.put("/save-modules/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.json({ success: false });
    }

    // 🔥 IMPORTANT: replace entire modules properly
    course.modules = req.body.modules;

    await course.save();

    res.json({ success: true });
  } catch (err) {
    console.error("Save modules error:", err);
    res.json({ success: false });
  }
});

// ===========================
// PUBLISH COURSE
// ===========================

app.put("/publish-course/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    console.log("Before:", course.status); // 👈 ADD

    course.status = "published";

    await course.save();

    console.log("After:", course.status); // 👈 ADD

    res.json({ success: true });
  } catch (err) {
    console.error("Publish error:", err);
    res.json({ success: false });
  }
});

// ===========================
// GET ALL COURSES
// ===========================

app.get("/get-courses", async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" });

    res.json({ success: true, courses });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ===========================
// DELETE COURSE
// ===========================

app.delete("/delete-course/:id", async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    res.json({ success: false });
  }
});

// ===========================
// ASSIGN COURSE TO USER
// ===========================

app.put("/assign-course", async (req, res) => {
  try {
    const { userId, courseIds } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false });
    }

    courseIds.forEach((courseId) => {
      if (!user.courses.map((id) => id.toString()).includes(courseId)) {
        user.courses.push(courseId);
      }
    });

    await user.save();

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.json({ success: false });
  }
});

// ===========================
// REMOVE COURSE TO USER
// ===========================

app.put("/remove-course", async (req, res) => {
  try {
    const { userId, courseId } = req.body;

    const user = await User.findById(userId);

    user.courses = user.courses.filter((id) => id.toString() !== courseId);

    await user.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false });
  }
});

// ===========================
// GET USER COURSES
// ===========================

app.get("/user-courses/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate("courses");

    console.log("User courses:", user.courses);

    res.json({ success: true, courses: user.courses });
  } catch (err) {
    res.json({ success: false });
  }
});

// This should always stay at the end

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
