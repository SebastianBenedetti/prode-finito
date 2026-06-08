import { useState, useEffect } from "react";
import { getMatches } from "../services/match.services";

export function useMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const data = await getMatches();
      setMatches(data);
    } catch (err) {
      setError("No se pudieron cargar los partidos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
  }, []);

  return { matches, loading, error, refetch: fetchMatches };
}