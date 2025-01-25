const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

const Resource = require("../models/ResourceModel");

// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid resource ID" });
  }
  next();
};

// Create a new resource
router.post("/", async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json({ message: "Resource created successfully", data: resource });
  } catch (err) {
    res.status(500).json({ message: "Error creating resource", error: err.message });
  }
});

// Get all resources
router.get("/", async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resources", error: err.message });
  }
});

// Get a single resource by ID
router.get("/:id", validateObjectId, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json(resource);
  } catch (err) {
    res.status(500).json({ message: "Error fetching resource", error: err.message });
  }
});

// Update a resource by ID
router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json({ message: "Resource updated successfully", data: resource });
  } catch (err) {
    res.status(500).json({ message: "Error updating resource", error: err.message });
  }
});

// Delete a resource by ID
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const resource = await Resource.findByIdAndDelete(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting resource", error: err.message });
  }
});

module.exports = router;
