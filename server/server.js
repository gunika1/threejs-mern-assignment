const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const objectRoutes = require("./routes/objectRoutes");

const app = express();

// CORS FIX
app.use(cors());

app.use(express.json());

// uploads folder access
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// test route
app.get("/", (req, res) => {
  res.json({
    message: "3D MERN API running",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/objects", objectRoutes);

// mongodb connect
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB error", err.message);
    process.exit(1);
  });