const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const authMiddleware = require("../middleware/authMiddleware");

const uploadDir = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get("/", authMiddleware, async (req, res) => {
  return res.json([]);
});

router.post(
  "/upload",
  authMiddleware,
  upload.single("model"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const baseUrl =
        process.env.BASE_URL || "http://localhost:5000";

      return res.json({
        _id: Date.now().toString(),
        name: req.file.originalname,
        fileUrl: `${baseUrl}/uploads/${req.file.filename}`,
        cameraPosition: null,
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      return res.status(500).json({
        message: error.message || "Upload failed",
      });
    }
  }
);

router.put("/:id/state", authMiddleware, async (req, res) => {
  return res.json({
    success: true,
    cameraPosition: req.body.cameraPosition,
  });
});

module.exports = router;