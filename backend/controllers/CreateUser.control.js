import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export default async function CreateUser(req, res) {
    let {username , email , password} = req.body;
    try {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, async (err, hash) => {
            const existingUser = await userModel.findOne({ email: email });
            if (existingUser) {
              return res.send({success: false  , message: "User already exists" });
            }
            const user = await userModel.create({
              email,
              password: hash,
              username,
            });
            const token = jwt.sign({id: user._id , email: user.email} , process.env.JWT_SECRET , {expiresIn: "7d"} )
            res.json({success: true , message: "User Created Succesfull" , user , token})
          });
        });
    } catch (error) {
        console.log(error.message);
        res.json({success: false , message: error.message});
    }
};




