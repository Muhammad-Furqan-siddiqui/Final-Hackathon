
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI; 

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.log("MongoDB error - not connected", err);
  });

module.exports = mongoose;








// // Import dependencies
// const express = require("express");
// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const bodyParser = require("body-parser");
// require("dotenv").config();

// // App setup
// const app = express();
// app.use(bodyParser.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // User Schema
// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// // Pre-save hook for password hashing
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const User = mongoose.model("User", userSchema);

// // Signup route
// app.post("/signup", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
//     if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const newUser = new User({ name, email, password });
//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(500).json({ message: "Error registering user", error: err.message });
//   }
// });

// // Login route
// app.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "All fields are required" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.MONGO_URI, { expiresIn: "1h" });
//     res.status(200).json({ message: "Login successful", token });
//   } catch (err) {
//     res.status(500).json({ message: "Error logging in", error: err.message });
//   }
// });

// // Get user by ID route
// app.get("/user/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findById(id).select("-password");
//     if (!user) return res.status(404).json({ message: "User not found" });

//     res.status(200).json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user", error: err.message });
//   }
// });

// // Start the server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));