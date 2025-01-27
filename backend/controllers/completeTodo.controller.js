export default async function completeTodo(req, res) {
  const todo = await todoModel.findOne({ _id: req.params.id });
  todo.status = "completed";
  await todo.save();
  res.json({ success: true });
}
