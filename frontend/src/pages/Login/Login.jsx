import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Blob from "../../components/common/Blob";
import Field from "../../components/common/Field";
import {
  DEV_LOGIN_HINT,
  getSessionUser,
  loginWithDevCredentials,
} from "../../utils/devAuth";
import "./Login.css";

const initialForm = { identifier: "", password: "" };

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  useEffect(() => {
    // Reserved for lightweight page-enter animation hooks.
  }, []);

  if (getSessionUser()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const result = loginWithDevCredentials(form.identifier, form.password);

    if (!result.success) {
      setError(result.message);
      return;
    }

    setError("");
    navigate("/dashboard");
  };

  const handleDemo = () => {
    setForm({
      identifier: "test@test",
      password: "password123",
    });
    setError("");
  };

  return (
    <div className="login-page">
      <div className="bg-blobs">
        <Blob className="blob blob-1" />
        <Blob className="blob blob-2" />
      </div>

      <div className="login-container">
        <h2 className="login-heading">Login to Moodify</h2>

        <button className="demo-btn" onClick={handleDemo}>
          Continue with Demo Account
        </button>

        <form className="login-form" onSubmit={handleSubmit}>
          <Field
            id="identifier"
            label="Email or Username"
            placeholder="Enter email or username"
            value={form.identifier}
            onChange={handleChange}
          />

          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="login-row">
            <span className="helper-text">{DEV_LOGIN_HINT}</span>
            <Link to="/register" className="link">
              Create account
            </Link>
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit" className="primary-btn">
            Continue
          </button>
        </form>

        <p className="footer-text">
          Don't have an account?{" "}
          <Link to="/register" className="link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
