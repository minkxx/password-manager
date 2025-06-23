import User from "../models/userModel.js";

export const getUserData = async (req, res) => {
    const userID = req.userId;
    const user = await User.findById(userID);
    if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
    }
    const toSendData = {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
    }
    return res.json(toSendData);
}