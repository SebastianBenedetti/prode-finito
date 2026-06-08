import { useAuth } from "../../context/AuthContext";
import "./navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  const initial = user?.username?.[0]?.toUpperCase() || "?";

  return (
    <nav className="navbar-prode">
      <span className="brand">
        PRODE <span>2026</span> - Finito
      </span>
      <div className="navbar-user">
        <span className="navbar-username">{user?.username}</span>
        <div className="navbar-avatar-placeholder">{initial}</div>
        <button className="btn-logout" onClick={logout}>
          Salir
        </button>
      </div>
    </nav>
  );
}