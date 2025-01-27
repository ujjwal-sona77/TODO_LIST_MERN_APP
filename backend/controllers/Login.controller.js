import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import userModel from "../models/user.model.js";

export default async function LoginUser(req, res) {
  let { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid username or password", success: false });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign(
            { email, id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
          );
          res.status(200).json({ message: "Login successful", success: true  , token});
        } else {
          return res.send({
            message: "Invalid username or password",
            success: false,
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
}
