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
    "mongodb+srv://yehezekieldaniel_db_user:HV6H27zoOhBvCAIw@cluster0.wni3hr0.mongodb.net/jireh?retryWrites=true&w=majority&appName=Cluster0",
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
  const user = await User.findById(req.params.id);

  res.json(user);
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

// This should always stay at the end

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
