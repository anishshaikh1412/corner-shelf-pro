const express = require("express");
const path = require("path");
const connectDB = require("../lib/db");
const Book = require("../models/Book");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "../views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "../public")));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("MongoDB connection failed:", err.message);
    if (req.path.startsWith("/api/")) {
      return res.status(503).json({ error: "Database connection failed. Check MONGO_URI and Atlas Network Access." });
    }
    return res.status(503).render("error", {
      title: "Connection issue",
      message: "We couldn't connect to the collection database. Check your MongoDB Atlas connection settings and try again."
    });
  }
});

app.get("/api/health", (req, res) => {
  res.json({ ok: true, database: "connected" });
});

app.get("/", async (req, res, next) => {
  try {
    const search = (req.query.search || "").trim();
    const genre = (req.query.genre || "").trim();
    const sort = req.query.sort || "newest";
    const filter = {};
    if (search) {
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      filter.$or = [
        { title: { $regex: safeSearch, $options: "i" } },
        { author: { $regex: safeSearch, $options: "i" } }
      ];
    }
    if (genre) filter.genre = genre;
    const sortMap = {
      newest: { createdAt: -1 },
      title: { title: 1 },
      "price-low": { price: 1 },
      "price-high": { price: -1 }
    };
    const [books, allBooks, genres, recent] = await Promise.all([
      Book.find(filter).sort(sortMap[sort] || sortMap.newest).lean(),
      Book.find().select("price status").lean(),
      Book.distinct("genre"),
      Book.find().sort({ createdAt: -1 }).limit(4).select("title author").lean()
    ]);
    const totalValue = allBooks.reduce((sum, b) => sum + (Number(b.price) || 0), 0);
    const stats = {
      total: allBooks.length,
      value: totalValue,
      genres: new Set(allBooks.map(b => b.genre)).size,
      reading: allBooks.filter(b => b.status === "Reading").length
    };
    res.render("index", {
      title: "Your personal library",
      books, genres: genres.sort(), search, selectedGenre: genre, sort,
      stats, recent
    });
  } catch (err) { next(err); }
});

app.get("/books/new", (req, res) => {
  res.render("form", { title: "Add a book", book: {}, mode: "new" });
});

app.post("/books", async (req, res, next) => {
  try {
    const { title, author, genre, price, cover, description, status } = req.body;
    await Book.create({ title, author, genre, price: Number(price), cover, description, status });
    res.redirect("/");
  } catch (err) {
    if (err.name === "ValidationError" || err.name === "CastError") {
      return res.status(400).render("error", { title: "Check the details", message: "Please check the required fields and make sure the price is a valid number." });
    }
    next(err);
  }
});

app.get("/books/:id/edit", async (req, res, next) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) return res.status(404).render("error", { title: "Book not found", message: "This book may have been removed from your library." });
    res.render("form", { title: "Edit book", book, mode: "edit" });
  } catch (err) { next(err); }
});

app.post("/books/:id", async (req, res, next) => {
  try {
    const { title, author, genre, price, cover, description, status } = req.body;
    await Book.findByIdAndUpdate(req.params.id, {
      title, author, genre, price: Number(price), cover, description, status
    }, { runValidators: true });
    res.redirect("/");
  } catch (err) { next(err); }
});

app.post("/books/:id/delete", async (req, res, next) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("/");
  } catch (err) { next(err); }
});

app.use((err, req, res, next) => {
  console.error("Application error:", err.message);
  if (res.headersSent) return next(err);
  res.status(500).render("error", {
    title: "Something went wrong",
    message: "That request couldn't be completed. Please try again."
  });
});

module.exports = app;
