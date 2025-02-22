import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   const user = await User.findOne({ email: decoded.email });


    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export const adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    console.log("Token: ",token)

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded", decoded)

    // Check if the decoded token matches the admin credentials
    if (decoded.email === "abc@admin.com") {
      req.user = decoded;
      next();
    } else {
      return res.status(403).json({ message: "Admin access required" });
    }
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
