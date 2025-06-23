import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import User from "../models/userModel.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }

    try {
        const existingUser = await User.findOne({email})
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await new User({name, email, password: hashedPassword})
        await newUser.save()

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        const mailOptions = {
            from: `"Password Manager" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Welcome to Password Manager",
            text: `Congratulations! Your account has been created successfully with email: ${email}.`,
        }
        await transporter.sendMail(mailOptions)
        return res.json({ message: "User registered successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const user = await User.findOne({email})
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {expiresIn: "7d"})
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        return res.json({ message: "Logged in successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        await res.clearCookie("token",
            {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            }
            );
        return res.json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const sendVerifyOTP = async (req, res) => {
    try {
        const userID = req.userId;
        const user = await User.findById(userID);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.verifyOtp = otp;
        user.verifyOtpExpiredAt = Date.now() + (60 * 60 * 1000);
        await user.save();
        const mailOptions = {
            from: `"Password Manager" <${process.env.SENDER_EMAIL}>`,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP is ${otp}. \n This OTP will expire in 1 hour.`,
        }
        await transporter.sendMail(mailOptions)
        return res.json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    const {otp} = req.body;
    const userID = req.userId;
    if (!userID || !otp) {
        return res.status(400).json({ message: "Please enter all fields" });
    }
    try {
        const user = await User.findById(userID);
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }
        if (user.verifyOtp ==='' || user.verifyOtp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }
        if (user.verifyOtpExpiredAt < Date.now()) {
            return res.status(400).json({ message: "OTP expired" });
        }

        user.isVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiredAt = 0;
        await user.save();
        return res.json({ message: "Email verified successfully" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success:true ,message: "User is authenticated" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const sendResetOTP = async (req, res) => {
    const {email} = req.body;
    if (!email) {
        return res.status(400).json({message: "Please login to access this route"});
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        user.resetOtp = otp;
        user.resetOtpExpiredAt = Date.now() + (10 * 60 * 1000);
        await user.save();

        const mailOptions = {
            from: `"Password Manager" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. \n This OTP will expire in 10 minutes.`,
        }
        await transporter.sendMail(mailOptions)
        return res.json({message: "Reset OTP sent successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const resetPassword = async (req, res) => {
    const {email, otp, newPassword} = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({message: "Please enter all fields"});
    }
    try {
        const user = await User.findOne({email});
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }
        if (user.resetOtp ==='' || user.resetOtp !== otp) {
            return res.status(400).json({message: "Invalid OTP"});
        }
        if (user.resetOtpExpiredAt < Date.now()) {
            return res.status(400).json({message: "OTP expired"});
        }

        user.password = await bcrypt.hash(newPassword, 12);
        user.resetOtp = '';
        user.resetOtpExpiredAt = 0;
        await user.save();
        return res.json({message: "Password reset successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}