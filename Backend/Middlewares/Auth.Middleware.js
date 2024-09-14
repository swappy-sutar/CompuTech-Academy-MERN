import jwt from "jsonwebtoken";
import { User } from "../Models/User.Model";

const auth = async (req, res, next) => {
  try {
    const token =
      req.body.token ||
      req.cookies.token ||
      req.header("Authorization").replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token is missing",
      });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log(decoded);

      req.user = decoded;
    } catch (error) {
      return res.status(401).json({
        status: false,
        message: "Invalid Token",
      });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "something went wrong While validating the token",
    });
  }
};

const isStudent = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("accountType");
    if (user.accountType === "Student") {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not a student",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "something went wrong While validating the user",
    });
  }
};

const isAmdin = async (res, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("accountType");
    if (user.accountType === "Admin") {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not an admin",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "something went wrong While validating the user",
    });
  }
};

const isInstructor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("accountType");
    if (user.accountType === "Instructor") {
      next();
    } else {
      return res.status(401).json({
        status: false,
        message: "You are not an instructor",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: false,
      message: "something went wrong While validating the user",
    })
  }
};

export { auth, isStudent, isAmdin, isInstructor };
