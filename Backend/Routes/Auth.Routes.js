import express from "express";
import { auth } from "../Middlewares/Auth.Middleware.js";
import {sendOTP, signup, login, changePassword } from "../Controllers/Auth.Controller.js"
import { resetPasswordToken, resetPassword } from "../Controllers/ResetPassword.Controller.js"


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendOTP", sendOTP);
router.post("/changePassword", auth, changePassword);
router.post("/resetPasswordToken", resetPasswordToken);
router.post("/resetPassword", resetPassword);



export default router;
