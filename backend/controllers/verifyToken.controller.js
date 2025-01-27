import jwt from "jsonwebtoken";

export default async function VerifyToken(req, res) {
  const token = req.params.token;
  if (!token) {
    return res.json({ success: false, message: "No token provided" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.json({ success: false, message: "Invalid token" });
      }
      return res.json({ success: true, message: "Token is valid" });
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}
