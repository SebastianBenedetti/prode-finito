import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { login } from "../../services/auth.services";
import "./login.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { login: loginCtx } = useAuth();
  const navigate = useNavigate();

  // Trae los usuarios del backend
  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data))
      .catch(() => {}); // si falla no pasa nada, igual pueden escribir el nombre
  }, []);

  const handleLogin = async (name) => {
    const u = name || username.trim();
    if (!u) return;
    setLoading(true);
    setError("");
    try {
      const data = await login(u);
      loginCtx(data.token);
      navigate("/");
    } catch (e) {
      setError("Usuario no encontrado. Chequeá el nombre.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="login-trophy">🏆</span>
          <div className="login-title">PRODE 2026 - Finito</div>
          <div className="login-subtitle">Mundial de Fútbol</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <label className="login-label">Tu usuario</label>
        <input
          className="login-input"
          type="text"
          placeholder="Ingresá tu nombre de usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoCapitalize="none"
          autoCorrect="off"
        />

        <button
          className="btn-login"
          onClick={() => handleLogin()}
          disabled={loading || !username.trim()}
        >
          {loading ? "Entrando..." : "ENTRAR"}
        </button>

        {users.length > 0 && (
          <div className="user-chips">
            <span className="user-chip-label">Acceso rápido</span>
            {users.map((u) => (
              <button
                key={u.id}
                className="user-chip"
                onClick={() => handleLogin(u.username)}
              >
                {u.username}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
