const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./userModel");
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

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

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
