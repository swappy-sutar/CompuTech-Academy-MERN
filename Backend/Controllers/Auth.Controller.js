    import { User } from "../Models/User.Model.js";
    import { OTP } from "../Models/Otp.Model.js";
    import { Profile } from "../Models/Profile.Model.js";
    import { optGenrator } from "otp-generator";
    import bcrypt from "bcrypt";
    import jwt from "jsonwebtoken";
    // import dotenv from "dotenv"
    // dotenv.config()

    const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
        return res.status(400).json({
            status: false,
            message: "User already registered",
        });
        }

        let otp = optGenrator.generate(6, {
        upperCase: false,
        lowercase: false,
        specialChars: false,
        });

        console.log("OTP:", otp);

        const uniqueOTP = await OTP.findOne({ opt: opt });

        while (uniqueOTP) {
        otp = optGenrator.generate(6, {
            upperCase: false,
            lowercase: false,
            specialChars: false,
        });
        console.log("OTP:", otp);
        }

        const optPayload = { email, otp };

        const otpBody = await OTP.create(optPayload);
        console.log("otpBody:", otpBody);

        res.status(200).json({
        status: true,
        message: "OTP sent successfully",
        otp: otpBody.opt,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        status: false,
        message: error.message,
        });
    }
    };

    const signup = async (req, res) => {
    try {
        const {
        firstName,
        lastName,
        email,
        password,
        conformPassword,
        accountType,
        otp,
        } = req.body;

        if (!firstName || !lastName || !email || !password || !conformPassword) {
        return res.status(400).json({
            status: false,
            message: "Please fill all the fields",
        });
        }

        if (password !== conformPassword) {
        return res.status(400).json({
            status: false,
            message: "Password and Confirm Password do not match",
        });
        }

        const userExist = await User.findOne({ email });

        if (userExist) {
        return res.status(400).json({
            status: false,
            message: "Email already exists",
        });
        }

        const recentOtp = await OTP.find({ email })
        .sort({ createdAt: -1 })
        .limit(1);

        console.log("recentOtp", recentOtp);

        if (recentOtp.length == 0) {
        return res.status(400).json({
            status: false,
            message: "OTP not found",
        });
        } else if (otp !== recentOtp.otp) {
        return res.status(400).json({
            status: false,
            message: "Invalid OTP",
        });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const profileDetails = await Profile.create({
        gender: null,
        dateOfBirth: null,
        about: null,
        contactNumber: null,
        });

        const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        accountType,
        additionalDetails: profileDetails._id,
        image: `http://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        });

        res.status(200).json({
        status: true,
        data: user,
        message: "User created successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
        status: false,
        message: `User can't be registered please try again later`,
        });
    }
    };

    const login = async () => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
        return res.status(400).json({
            status: false,
            message: "Please enter both email and password",
        });
        }

        const user = await User.findOne({ email });

        if (!user) {
        return res.status(400).json({
            status: false,
            message: "User not found",
        });
        }

        if (await bcrypt.compare(password, user.password)) {
        const payload = {
            user: user._id,
            email: user.email,
            accountType: user.accountType,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "2h",
        });
        user.token = token;
        user.password = undefined;

        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), //3days
            httpOnly: true,
        };

        res.cookie("token", token, options).json({
            status: true,
            token: token,
            user: user,
            message: "User logged in successfully",
        });
        } else {
        return res.status(400).json({
            status: false,
            message: "Invalid password",
        });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
        status: false,
        message: `User can't be login please try again later`,
        });
    }
    };

    const changePassword = async (req,res)=>{
        const {oldPassword,newPassword,conformPassword} = req.body;

        if (!oldPassword || !newPassword || !conformPassword) {
            return res.status(400).json({
                status: false,
                message: "Please fill all fields",
            })
        }
        if (newPassword !== conformPassword) {
            return res.status(400).json({
                status: false,
                message: "Password and conform password must be the same",
            })
        }
        const user = await User.findOne({email: req.user.email})
        if (!user) {
            return res.status(400).json({
                status: false,
                message: "User not found",
            })
        }
        const isValidPassword = await bcrypt.compare(oldPassword, user.password)
        if (!isValidPassword) {
            return res.status(400).json({
              status: false,
              message: "Old password is Incorrect",
            });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        await user.save();

        // const sendmail = await 

        return res.status(200).json({
            status: true,
            message: "Password changed successfully",
            });
        };



        
    
    export { sendOTP, signup, login, changePassword };
