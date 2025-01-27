import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

export default async function CreateUser(req, res) {
  let { username, email, password } = req.body;
  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
          return res.send({ message: "User already exists" });
        }
        const verificationCode = Math.floor(Math.random() * 9000 + 1000);
        const user = await userModel.create({
          email,
          password: hash,
          username,
          verificationCode: verificationCode,
        });
        // const transporter = nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 5000,
        //     secure: false,
        //     auth: {
        //       user: process.env.EMAIL,
        //       pass: process.env.PASS,
        //     },
        // })

        // const sendMail = async ()=> {
        //     const info = await transporter.sendMail({
        //         from: '"TODO" <ujjwalsonawat7@gmail.com>', // sender address
        //         to: email, // list of receivers
        //         subject: "Email Verification", // Subject line
        //         text: `Verify Your Email ${verificationCode}`, // plain text body
        //         html: "<b>Hello world?</b>", // html body
        // });

        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
        res.json({
          success: true,
          message: "User Created Succesfull",
          user,
          token,
        });
      });
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
}
