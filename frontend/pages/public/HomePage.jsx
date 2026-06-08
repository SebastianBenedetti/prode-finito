import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useMatches } from "../../hooks/useMatches";
import { getMyPredictions } from "../../services/prediction.services";
import MatchCard from "../../components/MatchCard/MatchCard";
import PredictionCard from "../../components/PredictionCard/PredictionCard";
import Leaderboard from "../../components/Leaderboard/Leaderboard";
import AdminPanel from "../../components/AdminPanel/AdminPanel";
import "./home.css";

const TABS = ["Fixture", "Mi Prode", "Tabla", "Perfil"];

function groupMatches(matches) {
  const grouped = {};
  for (const match of matches) {
    const key =
      match.phase === "Grupos" ? `Grupos — Grupo ${match.group}` : match.phase;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(match);
  }
  return grouped;
}

export default function HomePage() {
  const { user, token } = useAuth();
  const { matches, loading, refetch } = useMatches();
  const [tab, setTab] = useState("Fixture");
  const [predMap, setPredMap] = useState({});

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (token) {
      getMyPredictions(token).then((preds) => {
        const map = {};
        for (const p of preds) map[p.matchId] = p;
        setPredMap(map);
      });
    }
  }, [token]);

  const handlePredSaved = async () => {
    const preds = await getMyPredictions(token);
    const map = {};
    for (const p of preds) map[p.matchId] = p;
    setPredMap(map);
  };

  const handleAdminUpdated = () => {
    refetch();
    handlePredSaved();
  };

  const grouped = groupMatches(matches);

  return (
    <>
      {/* Hero */}
      <div className="home-hero">
        <h1>
          PRODE <span>MUNDIAL</span>
        </h1>
        <p>USA · Canadá · México — 2026</p>
      </div>

      {/* Tabs */}
      <div className="nav-tabs-prode">
        {TABS.map((t) => (
          <button
            key={t}
            className={`nav-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Contenido */}
      <div className="section-block">
        {/* ── FIXTURE ── */}
        {tab === "Fixture" && (
          <>
            {isAdmin && (
              <AdminPanel matches={matches} onUpdated={handleAdminUpdated} />
            )}
            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Cargando fixture...</p>
            ) : (
              Object.entries(grouped).map(([groupKey, groupMatches]) => (
                <div key={groupKey} className="phase-group">
                  <div className="phase-header">
                    <span
                      className={`phase-tag ${groupKey.startsWith("Grupos") ? "grupos" : "knockout"}`}
                    >
                      {groupKey}
                    </span>
                  </div>
                  {groupMatches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              ))
            )}
          </>
        )}

        {/* ── MI PRODE ── */}
        {tab === "Mi Prode" && (
          <>
            <div className="section-title">MI PRODE</div>
            <div className="section-subtitle">
              Ingresá tus predicciones antes de cada partido
            </div>

            {loading ? (
              <p style={{ color: "var(--text-muted)" }}>Cargando partidos...</p>
            ) : (
              Object.entries(grouped).map(([groupKey, groupMatches]) => (
                <div key={groupKey} className="phase-group">
                  <div className="phase-header">
                    <span
                      className={`phase-tag ${groupKey.startsWith("Grupos") ? "grupos" : "knockout"}`}
                    >
                      {groupKey}
                    </span>
                  </div>
                  {groupMatches
                    .filter((m) => m.homeTeam !== "Por definir")
                    .map((match) => (
                      <PredictionCard
                        key={match.id}
                        match={match}
                        prediction={predMap[match.id] || null}
                        onSaved={handlePredSaved}
                      />
                    ))}
                </div>
              ))
            )}
          </>
        )}

        {/* ── TABLA ── */}
        {tab === "Tabla" && (
          <>
            <div className="section-title">TABLA</div>
            <div className="section-subtitle">Puntos acumulados del prode</div>
            <Leaderboard />
          </>
        )}

        {/* ── PERFIL ── */}
        {tab === "Perfil" && <ProfileSection user={user} token={token} />}
      </div>
    </>
  );
}

function ProfileSection({ user, token }) {
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${user.id}`)
      .then((r) => r.json())
      .then((data) => {
        setBio(data.bio || "");
        setAvatarUrl(data.avatarUrl || "");
      })
      .finally(() => setLoading(false));
  }, [user.id]);

  const handleSave = async () => {
    await fetch("/api/users/me", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bio, avatarUrl }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading)
    return <p style={{ color: "var(--text-muted)" }}>Cargando perfil...</p>;

  return (
    <div className="profile-card">
      <div className="profile-avatar-wrap">
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            {user.username[0].toUpperCase()}
          </div>
        )}
      </div>

      <div className="profile-username">{user.username}</div>
      {user.role === "admin" && (
        <span className="profile-admin-badge">⚡ Admin</span>
      )}

      <label className="profile-label">URL de foto de perfil</label>
      <input
        className="profile-input"
        type="url"
        placeholder="https://..."
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />

      <label className="profile-label">Bio</label>
      <textarea
        className="profile-textarea"
        placeholder="Contá algo sobre vos..."
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        maxLength={200}
      />

      <button className="profile-btn" onClick={handleSave}>
        GUARDAR PERFIL
      </button>
      {saved && <div className="profile-saved">¡Perfil actualizado! ✓</div>}
    </div>
  );
}
