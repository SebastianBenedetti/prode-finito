import { useState } from "react";
import { updateMatchResult } from "../../services/match.services";
import { useAuth } from "../../context/AuthContext";
import "./admin.css";

export default function AdminPanel({ matches, onUpdated }) {
  const { token } = useAuth();
  const [filter, setFilter] = useState("Grupos");
  const [scores, setScores] = useState({});
  const [saving, setSaving] = useState(null);

  const phases = ["Grupos", "Octavos", "Cuartos", "Semifinal", "Final"];

  const filtered = matches.filter(
    (m) => m.phase === filter && m.homeTeam !== "Por definir"
  );

  const setScore = (matchId, side, val) => {
    setScores((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [side]: val },
    }));
  };

  const handleSave = async (match) => {
    const s = scores[match.id] || {};
    const home = s.home ?? match.homeScore ?? "";
    const away = s.away ?? match.awayScore ?? "";
    if (home === "" || away === "") return;
    setSaving(match.id);
    try {
      await updateMatchResult(match.id, Number(home), Number(away), token);
      if (onUpdated) onUpdated();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel-title">
        🛠 Panel Admin — Cargar Resultados
      </div>

      <div className="admin-filter-tabs">
        {phases.map((p) => (
          <button
            key={p}
            className={`admin-filter-tab ${filter === p ? "active" : ""}`}
            onClick={() => setFilter(p)}
          >
            {p}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
          No hay partidos disponibles para esta fase aún.
        </p>
      )}

      {filtered.map((match) => {
        const s = scores[match.id] || {};
        const homeVal = s.home ?? (match.homeScore !== null ? String(match.homeScore) : "");
        const awayVal = s.away ?? (match.awayScore !== null ? String(match.awayScore) : "");

        return (
          <div key={match.id} className="admin-match-row">
            <div className="admin-match-teams">
              {match.homeFlag} {match.homeTeam} vs {match.awayTeam} {match.awayFlag}
              {match.played && (
                <span style={{ marginLeft: 8, color: "#1a6630", fontSize: "0.75rem" }}>
                  ✓ Cargado: {match.homeScore}–{match.awayScore}
                </span>
              )}
            </div>
            <div className="admin-inputs">
              <input
                className="admin-score-input"
                type="number"
                min="0"
                max="20"
                value={homeVal}
                onChange={(e) => setScore(match.id, "home", e.target.value)}
                placeholder="0"
              />
              <span style={{ fontFamily: "var(--font-display)", color: "var(--text-muted)" }}>–</span>
              <input
                className="admin-score-input"
                type="number"
                min="0"
                max="20"
                value={awayVal}
                onChange={(e) => setScore(match.id, "away", e.target.value)}
                placeholder="0"
              />
              <button
                className="btn-admin-save"
                onClick={() => handleSave(match)}
                disabled={saving === match.id}
              >
                {saving === match.id ? "..." : match.played ? "Actualizar" : "Cargar"}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}