import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAccount } from "../data/mockData";

function useLogin() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage]   = useState("");
  const [status, setStatus]     = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === adminAccount.email && password === adminAccount.password) {
      setStatus("success");
      setMessage("Login successful! Redirecting…");
      setTimeout(() => navigate("/dashboard"), 800);
    } else {
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