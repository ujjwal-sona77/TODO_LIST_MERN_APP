import { Router } from "express";
const router = Router();
import todoModel from "../models/todo.model.js";
import userModel from "../models/user.model.js";
import CreateTodo from "../controllers/CreateTodo.controller.js";
import jwt from "jsonwebtoken";
import GetAllTodos from "../controllers/getAllTodos.controller.js";
import VerifyToken from "../controllers/verifyToken.controller.js";
import DeleteTodo from "../controllers/deleteTodo.controller.js";
import pendingTodo from "../controllers/pendingTodo.controller.js";
import completeTodo from "../controllers/completeTodo.controller.js";

router.get("/get/all/todos/:user_email", GetAllTodos);

router.post("/complete/:id", completeTodo);

router.post("/pending/:id", pendingTodo);

router.post("/create/todo/:email", CreateTodo);

router.get("/delete/todo/:id", DeleteTodo);

router.get("/check/session/:token", VerifyToken);

export default router;
