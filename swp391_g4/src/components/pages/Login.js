import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      setLoading(false);
      return;
    }

    try {
      console.log("Sending login data:", formData);

      const response = await axios.post(
        "http://localhost:5000/api/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {

        localStorage.setItem('shipperName', response.data.shipper.FullName);
        localStorage.setItem('shipperId', response.data.shipper.ShipperID);
        
        navigate("/shipper");
      } else {
        setError(response.data.message || "Login failed.");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response) {
        setError(
          error.response.data.message ||
          "Login failed. Please try again later."
        );
      } else if (error.request) {
setError("Unable to connect to the server. Please try again later.");
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="login-container">
      <h1 className="login-title">Login</h1>

      <form className="login-form" onSubmit={handleLogin}>
        <input
          className="login-input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          className="login-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {error && <p className="login-error">{error}</p>}

      <div className="login-links">
        <button
          className="login-transparent-button"
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </button>
        <button
          className="login-transparent-button"
          onClick={() => navigate("/register")}
        >
          Register
        </button>
      </div>
    </div>
  );
};
export default Login; 

