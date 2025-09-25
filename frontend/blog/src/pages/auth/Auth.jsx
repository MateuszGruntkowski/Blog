import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../services/apiService";
import "./Auth.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let response;
      if (isLogin) {
        response = await apiService.login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await apiService.register({
          email: formData.email,
          password: formData.password,
          name: formData.name,
        });
      }

      login(response);
      navigate("/");
    } catch (err) {
      let errorMessage = "Error occurred";

      if (err.response?.status === 401) {
        errorMessage =
          err.response.data?.message || "Invalid email or password";
        console.log(err.response.data);
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid data provided";
        console.log(err);
      } else if (err.response) {
        errorMessage =
          err.response.data?.message ||
          `Server error: (${err.response.status})`;
        console.log(err.response.data?.message);
      } else {
        errorMessage = "Network error or server is unreachable";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="container">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">{isLogin ? "Sign in" : "Sign up"}</h2>

          {error && <div className="alert alert-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="form-group">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
            </button>
          </form>

          <div className="auth-switch">
            {isLogin ? (
              <>
                Don't have an account?{" "}
                <span
                  className="auth-switch-link"
                  onClick={() => setIsLogin(false)}
                >
                  Sign up
                </span>
              </>
            ) : (
              <>
                Do you already have an account?{" "}
                <span
                  className="auth-switch-link"
                  onClick={() => setIsLogin(true)}
                >
                  Sign in
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
