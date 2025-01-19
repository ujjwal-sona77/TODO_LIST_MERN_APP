import userModel from "../models/user.model.js";
import todoModel from "../models/todo.model.js";
export default async function CreateTodo(req, res) {
  let { title, description, priority, dueDate } = req.body;
  try {
    const user = await userModel.findOne({ email: req.params.email });
    const newTodo = await todoModel.create({
      title,
      description,
      priority,
      dueDate,
      user: user,
    });
    res.json({ success: true, message: "Created Succesfully" });

    user.todo_list.push(newTodo);
    await user.save(); // Save the updated user document
  } catch (err) {
    console.log(err.message);
    res.json({ success: false, message: err.message });
  }
}
