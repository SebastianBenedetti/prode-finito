import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

export const login = async (username) => {
  const { data } = await axios.post(`${BASE}/auth/login`, { username });
  return data;
};