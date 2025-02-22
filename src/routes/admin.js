import express from "express";
import { adminAuth } from "../middleware/auth.js";
import {
  getAllUsers,
  getTotalEnrollments,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/users", adminAuth, getAllUsers);
router.get("/enrollments", adminAuth, getTotalEnrollments);

export default router;
