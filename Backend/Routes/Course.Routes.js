import express from "express";
const router = express.Router();
import {isAdmin,isInstructor,isStudent,auth} from "../Middlewares/Auth.Middleware.js"

import { createCategory, getAllCategories, categoryPageDetails } from "../Controllers/Category.Controller.js";
import { createCourse,updateCourse,deleteCourse, getAllCourses, getCourseDetails} from "../Controllers/Course.Controller.js";

import { createSubSection, updateSubSection, deleteSubSection} from "../Controllers/SubSection.Controller.js";
import { createSection, updateSection, deleteSection} from "../Controllers/Section.Controller.js";
import { createRating, getAverageRating, getAllRating} from "../Controllers/RatingAndReview.controller.js";


// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

router.post("/create-course", auth ,isInstructor , createCourse);
router.post("/update-course", auth, isInstructor, updateCourse);
router.post("/delete-course", auth, isInstructor, deleteCourse);
router.post("/get-course-details", getCourseDetails);
router.get("/get-all-courses", getAllCourses);

router.post("/create-section", auth, isInstructor, createSection);
router.post("/update-section", auth, isInstructor, updateSection);
router.post("/delete-section", auth, isInstructor, deleteSection);

router.post("/create-sub-section", auth, isInstructor, createSubSection);
router.post("/update-sub-section", auth, isInstructor, updateSubSection);
router.post("/delete-sub-section", auth, isInstructor, deleteSubSection);


// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************

router.post("/create-rating",auth, isStudent, createRating);
router.get("/get-average-rating", getAverageRating);
router.get("/get-all-rating", getAllRating);


// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
router.post("/create-category", auth, isAdmin, createCategory);
router.get("/get-all-categories", getAllCategories);
router.get("/get-category-page-details", categoryPageDetails);


export default router;
