import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import apiRouter from "./routers/api.router.js";
import userRouter from "./routers/user.router.js";
const app = express();
app.use(morgan("dev"));
app.use(cookieParser());
app.use(cors({
    credentials: true,
    origin: "https://todo-list-phi-eight-89.vercel.app"
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use("/api" , apiRouter);
app.use("/user" , userRouter);


export default app;
