import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    // Accept both custom header and Bearer token
    const headerToken = req.headers.atoken || req.headers["authorization"]; // e.g., "Bearer <token>"
    if (!headerToken) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }

    const token = headerToken.startsWith("Bearer ") ? headerToken.slice(7) : headerToken;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Support both object payload (new) and string payload (legacy)
    if (decoded && typeof decoded === "object") {
      if (decoded.role !== "admin") {
        return res.status(401).json({ success: false, message: "Not Authorized" });
      }
    } else if (typeof decoded === "string") {
      // Accept legacy admin tokens (pre-migration)
      // If you want to be stricter, replace this with a 401 once all clients are migrated
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};

export default authAdmin;
