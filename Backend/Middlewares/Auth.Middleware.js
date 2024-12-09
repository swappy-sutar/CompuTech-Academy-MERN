import jwt from "jsonwebtoken";
import { User } from "../Models/User.Model.js";

const auth = async (req, res, next) => {
  try {
    const token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.body?.token ||
      req.header("token") ||
      req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        status: false,
        message: "Token is missing",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      req.user = {
        id: decoded.id || decoded.user,
        email: decoded.email,
        accountType: decoded.accountType,
        iat: decoded.iat,
        exp: decoded.exp,
      };

      next();
    } catch (error) {
      console.log("Token is expire", error);
      return res.status(400).json({
        status: false,
        message: "Your session is expire, Please Login Again!!",
      });
    }
  } catch (error) {
    console.log("Auth middleware error:", error);
    return res.status(400).json({
      status: false,
      message: "Something went wrong while validating the token",
    });
  }
};


const checkAccountType = async (req, res, next, expectedAccountType) => {
  try {
    const user = await User.findById(req.user.id).select("accountType");

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    if (user.accountType === expectedAccountType) {
      return next();
    } else {
      return res.status(400).json({
        status: false,
        message: `You are not a ${expectedAccountType.toLowerCase()}`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Something went wrong while validating the user",
    });
  }
};


const isStudent = (req, res, next) => checkAccountType(req, res, next, "Student");

const isAdmin = (req, res, next) => checkAccountType(req, res, next, "Admin");

const isInstructor = (req, res, next) => checkAccountType(req, res, next, "Instructor");

export { auth, isStudent, isAdmin, isInstructor };
