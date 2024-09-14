import cookieParser from "cookie-parser";
import express from "express"


const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


export {app};