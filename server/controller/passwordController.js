import Password from "../models/passwordModel.js";
import User from "../models/userModel.js";
import {decrypt, encrypt} from "../utils/password_encrypt.js";

export const getPasswords = async (req, res) => {
    const userID = req.userId;
    if (!userID) {
        return res.status(400).json({message: "Login required"});
    }

    try {
        const passwords = await Password.find({userID});

        const decryptedPasswords = passwords.map((entry) => ({
            ...entry._doc,
            password: decrypt(entry.password),
        }));

        return res.json(decryptedPasswords);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};

export const addNewPassword = async (req, res) => {
    const userID = req.userId;
    if (!userID) {
        return res.status(400).json({success: false, message: "Login required"});
    }
    const {website, username, password} = req.body;
    if (!website || !username || !password) {
        return res.status(400).json({success: false, message: "Please enter all fields"});
    }
    try {
        const user = await User.findById(userID);
        const passwords = await Password.find({userID});
        if (user.isVerified === false && passwords.length >= 3) {
            return res.status(400).json({success: false, message: "Please verify your email to add more passwords"});
        }

        const isExist = await Password.findOne({userID, website, username});
        if (isExist) {
            return res.status(400).json({success: false, message: "Password already exists"});
        }

        const hashedPassword = encrypt(password);

        const new_password = await new Password({userID, website, username, password: hashedPassword});
        await new_password.save();

        return res.json({success: true, message: "Password added successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

export const deletePassword = async (req, res) => {
    const {password_id} = req.body;
    if (!password_id) {
        return res.status(400).json({success: false, message: "Please enter all fields"});
    }
    try {
        await Password.findByIdAndDelete(password_id);
        return res.json({success: true, message: "Password deleted successfully"});
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }
}

export const updatePassword = async (req, res) => {
    const {password_id, ...update_fields} = req.body;
    if (!password_id) {
        return res.status(400).json({message: "password_id is required"});
    }
    if (!update_fields || Object.keys(update_fields).length === 0) {
        return res.status(400).json({message: "At least one of website, username, or password must be provided"});
    }

    try {
        let isExist;
        if (update_fields.password) {
            update_fields.password = encrypt(update_fields.password);
            isExist = await Password.findByIdAndUpdate(password_id, update_fields, {new: true});
        } else {
            isExist = await Password.findByIdAndUpdate(password_id, update_fields, {new: true});
        }
        if (!isExist) {
            return res.status(400).json({message: "Password not found"});
        }
        return res.json({message: "Password updated successfully"});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}