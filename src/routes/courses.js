import express from "express";
import { auth, adminAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

router.get("/", getAllCourses);
router.get("/:id", getCourse);
// router.post("/new", adminAuth, upload.single("image"), createCourse);
// routes/courses.js
router.post(
  "/new",
  adminAuth,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "pdf", maxCount: 1 }
  ]),
  createCourse
);

router.put("/update/:id", adminAuth, upload.single("image"), updateCourse);
router.delete("/delete/:id", adminAuth, deleteCourse);

export default router;
