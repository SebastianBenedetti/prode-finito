import { Prediction, Match } from "../models/relations.js";

// Lógica de puntos:
// Resultado exacto → 3 pts
// Empate predicho y salió empate → 3 pts (ya cubierto por exacto)
// Ganador correcto pero marcador distinto → 1 pt
// Todo lo demás → 0 pts
export const calculatePoints = (prediction, result) => {
  const { homeScore: ph, awayScore: pa } = prediction;
  const { homeScore: rh, awayScore: ra } = result;

  // Exacto
  if (ph === rh && pa === ra) return 3;

  // Ganador correcto
  const predWinner = ph > pa ? "home" : ph < pa ? "away" : "draw";
  const realWinner = rh > ra ? "home" : rh < ra ? "away" : "draw";

  if (predWinner === realWinner) return 1;

  return 0;
};

export const upsertPrediction = async (
  userId,
  matchId,
  homeScore,
  awayScore,
) => {
  const match = await Match.findByPk(matchId);
  if (!match) throw new Error("Partido no encontrado");
  if (match.played)
    throw new Error(
      "El partido ya fue jugado, no podés modificar tu predicción",
    );

  const [prediction, created] = await Prediction.findOrCreate({
    where: { userId, matchId },
    defaults: { homeScore, awayScore },
  });

  if (!created) {
    prediction.homeScore = homeScore;
    prediction.awayScore = awayScore;
    prediction.points = null;
    await prediction.save();
  }

  return prediction;
};

export const getPredictionsByUser = async (userId) => {
  return await Prediction.findAll({
    where: { userId },
    include: [{ model: Match }],
  });
};

export const getLeaderboard = async () => {
  const { User, Prediction } = await import("../models/relations.js");
  const users = await User.findAll({
    attributes: ["id", "username", "avatarUrl"],
    include: [{ model: Prediction, attributes: ["points"] }],
  });

  const leaderboard = users.map((u) => {
    const predictions = u.Predictions || [];
    const totalPoints = predictions.reduce(
      (sum, p) => sum + (p.points || 0),
      0,
    );
    const exactos = predictions.filter((p) => p.points === 3).length;
    const ganadores = predictions.filter((p) => p.points === 1).length;
    return {
      id: u.id,
      username: u.username,
      avatarUrl: u.avatarUrl,
      totalPoints,
      exactos,
      ganadores,
    };
  });

  return leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);
};
