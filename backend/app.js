import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRouter from "./routers/api.routes.js";
import userRouter from "./routers/user.routes.js";
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "https://todo-list-app-ujjwal.vercel.app",
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api" , apiRouter);
app.use("/user" , userRouter);


export default app;
