import express from "express";
import { verifySignature, capturePayment } from "../Controllers/Payment.Controller.js";
import { isStudent , auth} from "../Middlewares/Auth.Middleware.js";

const router = express.Router();

router.post("/capture-payment",auth,isStudent, capturePayment);
router.post("/verify-signature", verifySignature);

export default router;