import todoModel from "../models/todo.model.js";
import userModel from "../models/user.model.js";

export default async function GetAllTodos(req, res) {
  const user = await userModel.findOne({ email: req.params.user_email });
  const todos = await todoModel.find({ user });
  res.json({ todos });
}
