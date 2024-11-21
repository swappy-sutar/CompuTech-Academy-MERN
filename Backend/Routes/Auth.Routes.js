import express from "express";
import { auth } from "../Middlewares/Auth.Middleware.js";
import {sendOTP, signup, login, changePassword } from "../Controllers/Auth.Controller.js"
import { resetPasswordToken, resetPassword } from "../Controllers/ResetPassword.Controller.js"


const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-OTP", sendOTP);
router.post("/change-password", auth, changePassword);
router.post("/reset-password-token", resetPasswordToken);
router.post("/reset-password", resetPassword);



export default router;
