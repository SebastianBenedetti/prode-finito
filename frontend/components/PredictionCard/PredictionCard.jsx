import { useState } from "react";
import { savePrediction } from "../../services/prediction.services";
import { useAuth } from "../../context/AuthContext";
import "./prediction.css";

function PointsBadge({ points, played }) {
  if (!played) return <span className="pred-points-badge pts-pending">Pendiente</span>;
  if (points === null) return <span className="pred-points-badge pts-pending">—</span>;
  if (points === 3) return <span className="pred-points-badge pts-3">⭐ 3 pts</span>;
  if (points === 1) return <span className="pred-points-badge pts-1">✓ 1 pt</span>;
  return <span className="pred-points-badge pts-0">✗ 0 pts</span>;
}

export default function PredictionCard({ match, prediction, onSaved }) {
  const { token } = useAuth();
  const [home, setHome] = useState(prediction?.homeScore ?? "");
  const [away, setAway] = useState(prediction?.awayScore ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const isLocked = match.played;

  const handleSave = async () => {
    if (home === "" || away === "") return;
    setSaving(true);
    try {
      await savePrediction(match.id, Number(home), Number(away), token);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      if (onSaved) onSaved();
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const hasChanged =
    String(home) !== String(prediction?.homeScore ?? "") ||
    String(away) !== String(prediction?.awayScore ?? "");

  return (
    <div className={`prediction-card ${isLocked ? "locked" : ""}`}>
      <div className="prediction-match-row">
        <div className="pred-team">
          <span className="pred-flag">{match.homeFlag || "🏳️"}</span>
          <span>{match.homeTeam}</span>
        </div>

        <div className="pred-inputs">
          <input
            className="score-input"
            type="number"
            min="0"
            max="20"
            value={home}
            onChange={(e) => setHome(e.target.value)}
            disabled={isLocked}
          />
          <span className="score-sep">–</span>
          <input
            className="score-input"
            type="number"
            min="0"
            max="20"
            value={away}
            onChange={(e) => setAway(e.target.value)}
            disabled={isLocked}
          />
        </div>

        <div className="pred-team right">
          <span>{match.awayTeam}</span>
          <span className="pred-flag">{match.awayFlag || "🏳️"}</span>
        </div>
      </div>

      <div className="pred-actions">
        <PointsBadge points={prediction?.points} played={match.played} />

        {isLocked ? (
          <span className="pred-locked-label">🔒 Partido jugado</span>
        ) : saved ? (
          <span className="saved-toast">¡Guardado!</span>
        ) : (
          <button
            className="btn-save-pred"
            onClick={handleSave}
            disabled={saving || !hasChanged || home === "" || away === ""}
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        )}
      </div>
    </div>
  );
}