import axios from "axios";

const BASE = "/api";

export const login = async (username) => {
  const { data } = await axios.post(`${BASE}/auth/login`, { username });
  return data; // { token, user }
};