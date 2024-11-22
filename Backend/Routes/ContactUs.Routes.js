import express from "express";
import { sendMessage } from "../Controllers/ContactUs.Controller.js"

const router = express.Router();

router.post("/send-message", sendMessage);


export default router;
