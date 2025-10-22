import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";
import "./Login.css"; // same theme

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);
    setLoading(true);

    try {
      const { data } = await API.post("/users", { name, email, password, gender });

      // ✅ Save user info immediately for auto-login
      localStorage.setItem("userInfo", JSON.stringify(data));

      setMessage("🎉 Registration successful! Redirecting to dashboard...");
      setTimeout(() => navigate("/dashboard"), 2000);
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      const msg = error?.response?.data?.message || "Server error — please try again later!";
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h1 className="app-title">
            Smart<span>Scheduler</span>
          </h1>
          <h2 className="login-heading">Join Smart Scheduler Family 💙</h2>
          <p className="login-subtext">Simple ✨ Efficient 🪄 Organized ⚙️</p>

          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="input-field">
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
                className="themed-input"
              >
                <option value="" disabled>
                  Gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <p className="register-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>

          {message && (
            <div
              className={`message ${isError ? "error" : "success"}`}
              style={{
                marginTop: "15px",
                padding: "10px",
                borderRadius: "8px",
                backgroundColor: isError ? "#ffcccc" : "#e6ffe6",
                color: isError ? "#b30000" : "#006600",
                fontWeight: "500",
                textAlign: "center",
                animation: "fadeIn 0.5s ease-in-out",
              }}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
