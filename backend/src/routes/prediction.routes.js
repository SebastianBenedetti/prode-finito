import { Router } from "express";
import {
  upsertPrediction,
  getPredictionsByUser,
  getLeaderboard,
} from "../services/prediction.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Leaderboard — público
router.get("/leaderboard", async (req, res) => {
  try {
    const data = await getLeaderboard();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Predicciones del usuario logueado
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const predictions = await getPredictionsByUser(req.user.id);
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear o actualizar predicción
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { matchId, homeScore, awayScore } = req.body;
    if (matchId === undefined || homeScore === undefined || awayScore === undefined) {
      return res.status(400).json({ error: "matchId, homeScore y awayScore requeridos" });
    }
    const prediction = await upsertPrediction(
      req.user.id,
      matchId,
      Number(homeScore),
      Number(awayScore)
    );
    res.json(prediction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;