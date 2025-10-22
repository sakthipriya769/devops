import express from "express";
import multer from "multer";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Multer config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Public routes
router.post("/", registerUser);
router.post("/login", authUser);

// Private routes
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, upload.single("profilePic"), updateUserProfile);

export default router;
