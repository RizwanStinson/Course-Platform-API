import express from "express";
import { auth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getAllUser,
  getUserProfile,
  updateUserProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  getEnrolledCourses,
  enrollCourse,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/all-profile", getAllUser)
router.get("/profile/:id", auth, getUserProfile);
router.put("/profile/:id", auth, upload.single("image"), updateUserProfile);
router.get("/favorites/:id", auth, getFavorites);
router.post("/favorites", auth, addToFavorites);
router.delete("/favorites/:courseId", auth, removeFromFavorites);
router.get("/enrolled/:id", auth, getEnrolledCourses);
router.post("/enroll", auth, enrollCourse);

export default router;
