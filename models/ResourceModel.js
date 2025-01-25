const mongoose = require("mongoose");

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number }, // Example field, you can add or remove fields as needed
  },
  { timestamps: true }
);

const Resource = mongoose.model("Resource", resourceSchema);

module.exports = Resource;
