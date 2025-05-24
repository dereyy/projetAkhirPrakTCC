import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log("Attempting login to:", `${config.API_URL}/api/user/login`);
      
      const response = await axios.post(
        `${config.API_URL}/api/user/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Login response:", response.data);
      const { accessToken } = response.data;
      
      if (!accessToken) {
        throw new Error("Token tidak ada di response");
      }

      localStorage.setItem("accessToken", accessToken);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      
      if (err.response) {
        // Server responded with error
        setError(err.response.data?.msg || `Server error: ${err.response.status}`);
      } else if (err.request) {
        // Request made but no response
        setError(`Tidak dapat terhubung ke server. Pastikan server berjalan di ${config.API_URL}`);
      } else {
        // Other errors
        setError(err.message || "Terjadi kesalahan saat login");
      }
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Login</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="form-button">
            Login
          </button>
        </form>
        <p className="auth-footer">
          Belum punya akun? <a href="/register">Daftar</a>
        </p>
      </div>
    </div>
  );
};

export default Login; 