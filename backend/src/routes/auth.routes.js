import { Router } from "express";
import { loginUser } from "../services/auth.service.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username requerido" });
    const data = await loginUser(username);
    res.json(data);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router;
