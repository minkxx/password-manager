import express from "express";
import {
    register,
    login,
    logout,
    sendVerifyOTP,
    verifyEmail,
    isAuthenticated,
    sendResetOTP, resetPassword
} from "../../controller/authController.js";
import userAuth from "../../middleware/userAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("/api/auth endpoint");
})

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/send-verify-otp", userAuth, sendVerifyOTP);
router.post("/verify-email", userAuth, verifyEmail);
router.get("/is-auth", userAuth, isAuthenticated);
router.post("/send-reset-otp", sendResetOTP);
router.post("/reset-password", resetPassword);

export default router;