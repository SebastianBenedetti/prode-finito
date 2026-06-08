import axios from "axios";

const BASE = "/api";

export const getMyPredictions = async (token) => {
  const { data } = await axios.get(`${BASE}/predictions/my`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const savePrediction = async (matchId, homeScore, awayScore, token) => {
  const { data } = await axios.post(
    `${BASE}/predictions`,
    { matchId, homeScore, awayScore },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const getLeaderboard = async () => {
  const { data } = await axios.get(`${BASE}/predictions/leaderboard`);
  return data;
};