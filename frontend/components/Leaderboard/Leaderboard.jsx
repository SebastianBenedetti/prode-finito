import { useState, useEffect } from "react";
import { getLeaderboard } from "../../services/prediction.services";
import "./leaderboard.css";

const rankClass = (i) => {
  if (i === 0) return "top1";
  if (i === 1) return "top2";
  if (i === 2) return "top3";
  return "";
};

const rankSymbol = (i) => {
  if (i === 0) return "🥇";
  if (i === 1) return "🥈";
  if (i === 2) return "🥉";
  return i + 1;
};

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Cargando tabla...</p>;

  return (
    <div className="leaderboard-list">
      {data.map((entry, i) => (
        <div key={entry.id} className={`leaderboard-row ${rankClass(i)}`}>
          <div className={`lb-rank rank-${i + 1}`}>{rankSymbol(i)}</div>

          {entry.avatarUrl ? (
            <img className="lb-avatar" src={entry.avatarUrl} alt={entry.username} />
          ) : (
            <div className="lb-avatar-placeholder">
              {entry.username[0].toUpperCase()}
            </div>
          )}

          <div className="lb-info">
            <div className="lb-username">{entry.username}</div>
            <div className="lb-stats">
              <span>⭐ {entry.exactos} exactos</span>
              <span>✓ {entry.ganadores} gan.</span>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div className="lb-points">{entry.totalPoints}</div>
            <div className="lb-points-label">PTS</div>
          </div>
        </div>
      ))}
    </div>
  );
}