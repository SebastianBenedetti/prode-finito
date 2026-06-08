import { Router } from "express";
import { getAllMatches, updateMatchResult } from "../services/match.service.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { roleMiddleware } from "../middlewares/role.middleware.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const matches = await getAllMatches();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Solo admin puede cargar resultados
router.put(
  "/:id/result",
  authMiddleware,
  roleMiddleware("admin"),
  async (req, res) => {
    try {
      const { homeScore, awayScore } = req.body;
      if (homeScore === undefined || awayScore === undefined) {
        return res.status(400).json({ error: "Scores requeridos" });
      }
      const match = await updateMatchResult(
        req.params.id,
        Number(homeScore),
        Number(awayScore)
      );
      res.json(match);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

export default router;