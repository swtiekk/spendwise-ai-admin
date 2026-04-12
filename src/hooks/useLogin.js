import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../config";

function useLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [status, setStatus]     = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password }),
      });

      if (!res.ok) throw new Error('Invalid credentials');

      const data = await res.json();

      // check if admin
      const userRes = await fetch(`${BASE_URL}/auth/me/`, {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userRes.json();

      if (!userData.is_staff) {
        setStatus("error");
        setMessage("Access denied. Admin accounts only.");
        return;
      }

      localStorage.setItem('adminToken', data.access);
      setStatus("success");
      setMessage("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 800);

    } catch (err) {
      setStatus("error");
      setMessage("Invalid credentials. Please try again.");
    }
  };

  return {
    email, setEmail,
    password, setPassword,
    message,
    status,
    handleLogin,
  };
}

export default useLogin;