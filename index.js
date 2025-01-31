const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const app = express();

// 🔥 Enable CORS
app.use(cors({
    origin: "https://final-hackathon-frontend-h2il.vercel.app",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization"
}));

// 🔥 Handle Preflight Requests
app.options("*", (req, res) => {
    res.header("Access-Control-Allow-Origin", "https://final-hackathon-frontend-h2il.vercel.app");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendStatus(200);
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());

// Database Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch((err) => console.error("❌ MongoDB Connection Error:", err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hash password before saving
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const User = mongoose.model("User", userSchema);

// Signup Route
app.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ message: "All fields are required" });

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Error registering user", error: err.message });
    }
});

// Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ message: "Error logging in", error: err.message });
    }
});

// Get user by ID
app.get("/user/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

// Logout Route
app.post("/logout", (req, res) => {
    req.headers.authorization = null;
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
});

// Todo Schema
const TodoSchema = new mongoose.Schema({
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", TodoSchema);

// Todo Routes
app.get("/api/todos", async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.post("/api/todos", async (req, res) => {
    try {
        const todo = new Todo({ text: req.body.text });
        const newTodo = await todo.save();
        res.status(201).json(newTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.put("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        todo.text = req.body.text || todo.text;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;

        const updatedTodo = await todo.save();
        res.json(updatedTodo);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

app.delete("/api/todos/:id", async (req, res) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) return res.status(404).json({ message: "Todo not found" });

        await todo.remove();
        res.json({ message: "Todo deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Microfinance Schema
const applicationSchema = new mongoose.Schema({
    name: String,
    city: String,
    country: String,
    status: { type: String, default: "pending" },
    token: String,
});
const Application = mongoose.model("Application", applicationSchema);

// Microfinance Routes
app.post("/api/applications", async (req, res) => {
    const { name, city, country } = req.body;
    try {
        const application = new Application({ name, city, country });
        await application.save();
        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ error: "Error saving application" });
    }
});

app.put("/api/applications/:id", async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const application = await Application.findByIdAndUpdate(id, { status }, { new: true });
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: "Error updating application status" });
    }
});

app.post("/api/applications/:id/token", async (req, res) => {
    const { id } = req.params;
    const { token } = req.body;
    try {
        const application = await Application.findByIdAndUpdate(id, { token }, { new: true });
        res.json(application);
    } catch (error) {
        res.status(500).json({ error: "Error adding token to application" });
    }
});

app.get("/api/applications/filter", async (req, res) => {
    const { city, country } = req.query;
    try {
        const query = {};
        if (city) query.city = city;
        if (country) query.country = country;

        const applications = await Application.find(query);
        res.json(applications);
    } catch (error) {
        res.status(500).json({ error: "Error filtering applications" });
    }
});

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
