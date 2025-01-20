import { Router } from "express";
const router = Router();
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import CreateUser from "../controllers/CreateUser.control.js";
import LoginUser from "../controllers/Login.control.js";

router.get("/get/:email", async (req, res) => {
    try {
        const user = await userModel.findOne({ email: req.params.email }).populate("todo_list");
        res.json({user , success: true})
    } catch (err) {
        console.log(err.message);
        res.json({success: false , message: "Error"})
    }
});

router.post("/create", CreateUser);
router.post("/login" , LoginUser)

export default router;

