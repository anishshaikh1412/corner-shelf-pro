const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 140 },
  author: { type: String, required: true, trim: true, maxlength: 100 },
  genre: { type: String, required: true, trim: true, maxlength: 60 },
  price: { type: Number, required: true, min: 0 },
  cover: { type: String, trim: true, default: "" },
  description: { type: String, trim: true, maxlength: 1200, default: "" },
  status: { type: String, enum: ["Available", "Reading", "Wishlist"], default: "Available" }
}, { timestamps: true });

module.exports = mongoose.models.Book || mongoose.model("Book", bookSchema);
