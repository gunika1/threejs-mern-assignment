const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middleware/authMiddleware");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage });

router.post(
  "/upload",
  authMiddleware,
  upload.single("model"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No file uploaded" });
      }

      return res.json({
        _id: Date.now().toString(),
        name: req.file.originalname,
        fileUrl: `http://localhost:5000/uploads/${req.file.filename}`,
        cameraPosition: null,
      });

    } catch (error) {
      console.log("UPLOAD ERROR:", error);

      return res
        .status(500)
        .json({
          message: error.message || "Upload failed",
        });
    }
  }
);

router.put(
  "/:id/state",
  authMiddleware,
  async (req, res) => {
    try {
      return res.json({
        success: true,
        cameraPosition: req.body.cameraPosition,
      });
    } catch (error) {
      return res
        .status(500)
        .json({
          message: "Failed to save state",
        });
    }
  }
);

module.exports = router;