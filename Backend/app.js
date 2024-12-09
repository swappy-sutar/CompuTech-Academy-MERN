import express from "express";
import cors from "cors";
import {cloudinaryConnect} from "./Config/cloudinary.config.js"
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";

const app = express();

const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:3000", "https://computech-academy-swappy.vercel.app"],
  methods: ["POST", "GET","PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
app.options("*", cors());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

cloudinaryConnect();


import Auth from "./Routes/Auth.Routes.js";
import Course from "./Routes/Course.Routes.js";
import Profile from "./Routes/Profile.Routes.js";
import ContactUs from "./Routes/ContactUs.Routes.js";
import Payment from "./Routes/Payment.Routes.js";

app.use("/api/v1/auth", Auth);
app.use("/api/v1/course", Course);
app.use("/api/v1/profile", Profile);
app.use("/api/v1/support", ContactUs);
app.use("/api/v1/payment", Payment);

app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"Your server is running..."
    })
})


export { app };