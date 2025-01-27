import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to MongoDB");
        }).catch((error) => {
            console.log("Error connecting to MongoDB:", error.message);
            process.exit(1);
    });
}

export default connectDB;
