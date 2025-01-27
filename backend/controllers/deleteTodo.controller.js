export default async function DeleteTodo(req, res) {
  await todoModel.deleteOne({ _id: req.params.id });
  res.json({ success: true });
}
