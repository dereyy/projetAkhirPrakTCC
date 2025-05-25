import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Akses ditolak" });
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token data:", verified);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ msg: "Token tidak valid" });
  }
};

export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
};

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
};
