import React, { useEffect, useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import { ToastContainer } from "./components/Toast";
import { useToast } from "./hooks/useToast";
import "./App.css";

export default function App() {
  const { toasts, addToast, removeToast } = useToast();
  const [username, setUsername] = useState(() => localStorage.getItem("username"));

  useEffect(() => {
    const handleLogout = () => setUsername(null);
    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    setUsername(null);
    addToast("Da dang xuat.", "success");
  };

  return (
    <>
      {username ? (
        <HomePage addToast={addToast} username={username} onLogout={handleLogout} />
      ) : (
        <LoginPage addToast={addToast} onLogin={setUsername} />
      )}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
