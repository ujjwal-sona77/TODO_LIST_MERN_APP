export default async function pendingTodo(req, res) {
  const todo = await todoModel.findOne({ _id: req.params.id });
  todo.status = "pending";
  await todo.save();
  res.json({ success: true });
}
