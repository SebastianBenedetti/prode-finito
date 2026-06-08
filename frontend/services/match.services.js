import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

export const getMatches = async () => {
  const { data } = await axios.get(`${BASE}/matches`);
  return data;
};

export const updateMatchResult = async (matchId, homeScore, awayScore, token) => {
  const { data } = await axios.put(
    `${BASE}/matches/${matchId}/result`,
    { homeScore, awayScore },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};