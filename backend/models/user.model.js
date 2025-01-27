import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Password must be at least 6 characters long"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    todo_list: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Todo",
        },
    ],
    verficationCode: {
        type: Number
    }
});

const User = mongoose.model("User", userSchema);

export default User;
