function Navbar() {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 1.5rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        background:
          "linear-gradient(90deg, rgba(9, 18, 44, 0.95), rgba(31, 60, 136, 0.78))",
        backdropFilter: "blur(10px)",
      }}
    >
      <div>
        <p
          style={{
            margin: 0,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "#8fb3ff",
          }}
        >
          Moody AI
        </p>
        <h1 style={{ margin: "0.25rem 0 0", fontSize: "1.5rem" }}>
          Emotion Dashboard
        </h1>
      </div>

      <nav style={{ display: "flex", gap: "0.75rem" }}>
        <button style={navButtonStyle}>Login</button>
        <button style={{ ...navButtonStyle, background: "#4f8cff", color: "#fff" }}>
          Register
        </button>
      </nav>
    </header>
  );
}

const navButtonStyle = {
  border: "none",
  borderRadius: "999px",
  padding: "0.75rem 1rem",
  background: "rgba(255, 255, 255, 0.12)",
  color: "#e8eeff",
  cursor: "pointer",
};

export default Navbar;
