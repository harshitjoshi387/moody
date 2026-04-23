import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { getSessionUser, registerDevUser } from "../../utils/devAuth";

const initialForm = {
  name: "",
  email: "",
  password: "",
};

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  if (getSessionUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = registerDevUser(form);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  return (
    <div className="auth-page">
      <div className="auth-glow auth-glow-left" />
      <div className="auth-glow auth-glow-right" />
      <div className="auth-orb auth-orb-two" />
      <div className="auth-orb auth-orb-four" />

      <section className="auth-stage">
        <div className="auth-showcase">
          <p className="auth-kicker">Create Account</p>
          <h1>Same mood, same glow, now with a matching registration page.</h1>
          <p className="auth-copy">
            Agar demo login work na kare ya aap new test user banana chahte ho,
            yahan se local development account instantly create ho jayega.
          </p>
          <div className="auth-pill-row">
            <span className="auth-pill">Instant signup</span>
            <span className="auth-pill">Local session</span>
            <span className="auth-pill">Shared theme</span>
          </div>
        </div>

        <form className="auth-card" onSubmit={handleSubmit}>
          <div className="auth-brand">
            <div className="auth-logo">+</div>
            <h2>Create your account</h2>
          </div>

          <label className="auth-label" htmlFor="name">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="auth-input"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />

          <label className="auth-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="auth-input"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
          />

          <label className="auth-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="auth-input"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
          />

          {error ? <p className="auth-error">{error}</p> : null}

          <button type="submit" className="auth-primary-btn">
            Register
          </button>

          <p className="auth-footer-text">
            Already have an account?{" "}
            <Link className="auth-link" to="/login">
              Login here
            </Link>
          </p>
        </form>
      </section>
    </div>
  );
}

export default Register;
