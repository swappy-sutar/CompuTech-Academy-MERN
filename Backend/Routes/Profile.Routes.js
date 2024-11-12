import express from "express";
import { auth } from "../Middlewares/Auth.Middleware.js";
import {
  updateProfile,
  deleteAccount,
  getAllUsers,
  updateDisplayPicture,
  getEnrolledCourses,
} from "../Controllers/Profile.Controller.js";

const router = express.Router();
router.post("/update-profile", auth, updateProfile);
router.get("/get-users-details", auth, getAllUsers);
router.delete("/delete-account", auth, deleteAccount);

router.get("/get-enrolled-courses", auth, getEnrolledCourses);
router.post("/update-display-picture", auth, updateDisplayPicture);


export default router;
