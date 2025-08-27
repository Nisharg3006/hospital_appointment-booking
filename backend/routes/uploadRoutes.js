import express from "express";
import upload from "../middleware/multer.js";

const router = express.Router();

// File upload route
router.post("/file", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.json({ success: false, message: "No file uploaded" });
  }
  res.json({
    success: true,
    message: "File uploaded successfully",
    file: req.file,
  });
});

export default router;
