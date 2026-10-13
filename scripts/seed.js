require("dotenv").config();
const mongoose = require("mongoose");
const Book = require("../models/Book");

const sampleBooks = [
  { title: "The Garden of Small Things", author: "Mira Sen", genre: "Literary Fiction", price: 399, status: "Available", description: "A quiet, luminous story about family, memory, and the things we leave unsaid." },
  { title: "A Map of Elsewhere", author: "Arjun Mehta", genre: "Adventure", price: 449, status: "Reading", description: "A cartographer discovers that the blank spaces on his map are changing overnight." },
  { title: "The Last Lightkeeper", author: "Nina Kapoor", genre: "Mystery", price: 329, status: "Available", description: "An isolated lighthouse, a missing journal, and a secret that refuses to stay buried." },
  { title: "Notes from Tomorrow", author: "Kabir Rao", genre: "Science Fiction", price: 499, status: "Wishlist", description: "Letters from a future that may never happen begin arriving in the present." },
  { title: "A Softer Season", author: "Leela Iyer", genre: "Romance", price: 279, status: "Available", description: "Two strangers find a new beginning in a small mountain town." },
  { title: "The Art of Starting Again", author: "Dev Malhotra", genre: "Personal Growth", price: 349, status: "Reading", description: "Practical reflections on building better habits with patience and intention." }
];

async function main() {
  if (!process.env.MONGO_URI) throw new Error("Set MONGO_URI in .env before running the seed script.");
  await mongoose.connect(process.env.MONGO_URI);
  const count = await Book.countDocuments();
  if (count > 0) {
    console.log(`Seed skipped: ${count} books already exist. No data was changed.`);
  } else {
    await Book.insertMany(sampleBooks);
    console.log(`Added ${sampleBooks.length} sample books.`);
  }
  await mongoose.disconnect();
}
main().catch(err => {
  console.error("Seed failed:", err.message);
  process.exitCode = 1;
});
