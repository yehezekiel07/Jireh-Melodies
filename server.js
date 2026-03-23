require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const cors = require("cors");
const User = require("./models/userModel");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Admin Login

app.get("/create-admin", async (req, res) => {
  const existing = await User.findOne({ username: "admin" });

  // 🔥 ADD THIS CHECK
  if (existing) {
    return res.send("Admin already exists");
  }

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = new User({
    fullname: "Admin",
    phone: "0000000000",
    email: "admin@jireh.com",
    username: "admin",
    password: hashedPassword,
    role: "admin",
  });

  await admin.save();

  res.send("Admin created successfully");
});

// Checking whether is user is ADMIN or USER

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
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
    res.json({
      success: false,
      message: "Server error",
    });
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
    // 🔥 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      phone,
      email,
      username,
      password: hashedPassword,
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
    const users = await User.find({ role: "user" }).select("-password");
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

    if (!user) {
      return res.json(null);
    }

    const { password, ...safeUser } = user._doc;
    res.json(safeUser);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Delete User

app.delete("/delete-user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user.role === "superadmin") {
    return res.json({
      success: false,
      message: "Cannot delete superadmin",
    });
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({ success: true });
});

// Update User

app.put("/update-user/:id", async (req, res) => {
  const { fullname, phone, email, username, password } = req.body;

  let updateData = {
    fullname,
    phone,
    email,
    username,
  };

  if (password && password.trim() !== "") {
    const hashedPassword = await bcrypt.hash(password, 10);
    updateData.password = hashedPassword;
  }

  await User.findByIdAndUpdate(req.params.id, updateData);

  res.json({ success: true });
});

// Change Password //

app.put("/change-password", async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // 🔐 check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // 🔥 hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Server error" });
  }
});

// Course Related Code //

const Course = require("./models/courseModel");

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
      demoVideo: req.body.demoVideo,
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

    // 🔥 ADD THIS BLOCK
    if (user.role === "superadmin") {
      return res.json({
        success: false,
        message: "Cannot modify superadmin courses",
      });
    }

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
    const user = await User.findById(req.params.id);

    // 🔥 SUPERADMIN LOGIC
    if (user.role === "superadmin") {
      const allCourses = await Course.find({ status: "published" });

      return res.json({
        success: true,
        courses: allCourses,
      });
    }

    // normal users
    const populatedUser = await User.findById(req.params.id).populate(
      "courses",
    );

    res.json({
      success: true,
      courses: populatedUser.courses,
    });
  } catch (err) {
    res.json({ success: false });
  }
});

app.get("/create-superadmin", async (req, res) => {
  const existing = await User.findOne({ role: "superadmin" });

  if (existing) {
    return res.send("Superadmin already exists");
  }

  const hashedPassword = await bcrypt.hash("super123", 10);

  const superUser = new User({
    fullname: "Super Admin",
    phone: "9999999999",
    email: "super@jireh.com",
    username: "superadmin",
    password: hashedPassword,
    role: "superadmin",
  });

  await superUser.save();

  res.send("Superadmin created");
});

// This should always stay at the end

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
