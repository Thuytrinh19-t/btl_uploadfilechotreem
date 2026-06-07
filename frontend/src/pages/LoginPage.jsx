import React, { useState } from "react";
import { login, register } from "../api/api";

export default function LoginPage({ onLogin, addToast }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = mode === "register"
        ? form
        : { username: form.username, password: form.password };
      const response = mode === "register"
        ? await register(payload)
        : await login(payload);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("username", response.data.username);
      onLogin(response.data.username);
      addToast(mode === "register" ? "Dang ky thanh cong!" : "Dang nhap thanh cong!", "success");
    } catch (err) {
      addToast(err.response?.data?.detail || "Khong the xu ly yeu cau!", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-panel" onSubmit={handleSubmit}>
        <div className="login-brand">
          <div className="brand-logo">📚</div>
          <div>
            <h1 className="brand-name">Tai lieu cua Nhat Minh - 1S5</h1>
            <p className="brand-subtitle">
              {mode === "register" ? "Dang ky tai khoan moi" : "Dang nhap de xem va tai tai lieu"}
            </p>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Tai khoan</label>
          <input
            className="form-input"
            value={form.username}
            onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
            autoComplete="username"
            required
          />
        </div>

        {mode === "register" && (
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              autoComplete="email"
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Mat khau</label>
          <input
            className="form-input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            autoComplete="current-password"
            required
          />
        </div>

        <button className="btn btn-primary login-submit" type="submit" disabled={loading}>
          {loading ? "Dang xu ly..." : mode === "register" ? "Dang ky" : "Dang nhap"}
        </button>
        <button
          className="btn btn-secondary login-submit"
          type="button"
          disabled={loading}
          onClick={() => setMode((prev) => (prev === "login" ? "register" : "login"))}
        >
          {mode === "login" ? "Chua co tai khoan? Dang ky" : "Da co tai khoan? Dang nhap"}
        </button>
      </form>
    </div>
  );
}
