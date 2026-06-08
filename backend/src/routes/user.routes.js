import { Router } from "express";
import { getAllUsers, getUserById, updateUserProfile } from "../services/user.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { avatarUrl, bio } = req.body;
    const user = await updateUserProfile(req.user.id, { avatarUrl, bio });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;