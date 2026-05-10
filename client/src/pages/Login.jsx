import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);

      nav("/");
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <main className="auth">
      <form onSubmit={submit} className="card">
        <h1>Login</h1>

        <p>Access your Three.js object workspace.</p>

        <input
          type="email"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button type="submit">Login</button>

        {msg && <span className="error">{msg}</span>}

        <p>
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </main>
  );
}