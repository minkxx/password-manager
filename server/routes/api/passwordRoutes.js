import express from 'express';
import {addNewPassword, deletePassword, getPasswords, updatePassword} from "../../controller/passwordController.js";
import userAuth from "../../middleware/userAuth.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.send("/api/password endpoint");
})

router.get("/get-all-passwords", userAuth, getPasswords );
router.post("/add-password", userAuth, addNewPassword);
router.post("/delete-password", userAuth, deletePassword);
router.post("/update-password", userAuth, updatePassword);


export default router;