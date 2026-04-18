import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <header className="dashboard-navbar">
      <div>
        <p className="dashboard-kicker">Moody AI</p>
        <h1 className="dashboard-title">Emotion Dashboard</h1>
      </div>

      <nav className="dashboard-nav">
        <span className="dashboard-user">Signed in as {user?.name || "Guest"}</span>
        <Link className="dashboard-link-btn" to="/login">
          Login
        </Link>
        <button className="dashboard-link-btn dashboard-link-btn-primary" onClick={onLogout}>
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Navbar;
