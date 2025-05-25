import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  console.log("Auth middleware - Token:", token);

  if (!token) {
    return res.status(401).json({ msg: "Akses ditolak" });
  }

  try {
    const verified = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(400).json({ msg: "Token tidak valid" });
  }
};

// Export auth sebagai alias dari verifyToken
export const auth = verifyToken;

export const generateAccessToken = (user) => {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
};

export const generateRefreshToken = (user) => {
  return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}; 