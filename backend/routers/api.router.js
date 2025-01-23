import { Router } from "express";
const router = Router();
import todoModel from "../models/todo.model.js";
import userModel from "../models/user.model.js";
import CreateTodo from "../controllers/CreateTodo.control.js";

router.get("/", (req, res) => {
  res.send("Hello from API router");
});

router.get("/get/all/todos/:user_email", async (req, res) => {
  const user = await userModel.findOne({ email: req.params.user_email });
  const todos = await todoModel.find({ user });
  res.json({ todos });
});

router.post("/complete/:id", async (req, res) => {
  const todo = await todoModel.findOne({ _id: req.params.id });
  todo.status = "completed";
  await todo.save();
  res.json({ success: true });
});

router.post("/pending/:id", async (req, res) => {
  const todo = await todoModel.findOne({ _id: req.params.id });
  todo.status = "pending";
  await todo.save();
  res.json({ success: true });
});

router.post("/create/todo/:email", CreateTodo);

router.get("/delete/todo/:id", async (req, res) => {
  await todoModel.deleteOne({ _id: req.params.id });
  res.json({ success: true });
});

export default router;
