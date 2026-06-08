import "./match.css";

export default function MatchCard({ match }) {
  const isPlayed = match.played;
  const isPending = match.homeTeam === "Por definir";

  return (
    <div className={`match-card ${isPlayed ? "played" : ""} ${isPending ? "undefined-match" : ""}`}>
      <div className="match-team">
        <span className="match-flag">{match.homeFlag || "🏳️"}</span>
        <span>{match.homeTeam}</span>
      </div>

      <div className="match-score-box">
        {isPlayed ? (
          <span className="match-score">
            {match.homeScore} – {match.awayScore}
          </span>
        ) : (
          <span className="match-vs">VS</span>
        )}
        {match.matchDate && !isPlayed && (
          <span className="match-date">
            {new Date(match.matchDate).toLocaleDateString("es-AR", {
              day: "numeric",
              month: "short",
            })}
          </span>
        )}
      </div>

      <div className="match-team away">
        <span className="match-flag">{match.awayFlag || "🏳️"}</span>
        <span>{match.awayTeam}</span>
      </div>
    </div>
  );
}