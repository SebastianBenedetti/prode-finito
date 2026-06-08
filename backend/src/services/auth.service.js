import jwt from "jsonwebtoken";
import { User } from "../models/relations.js";

// Login solo por username, sin password
export const loginUser = async (username) => {
  const user = await User.findOne({ where: { username } });

  if (!user) {
    throw new Error("Usuario no encontrado");
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
};