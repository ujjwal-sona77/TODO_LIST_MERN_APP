export default async function VerifyToken(req, res) {
  const token = req.params.token;
  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
