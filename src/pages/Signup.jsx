import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await signup(name, email, password);
      navigate("/home");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="page">
      <h2 className="pageTitle">Sign up</h2>
      <form className="formCard" onSubmit={onSubmit}>
        {err && <div className="empty" style={{ color: "#b91c1c", borderColor: "#fecaca" }}>{err}</div>}
        <div className="field">
          <label>Name</label>
          <input value={name} onChange={(e)=>setName(e.target.value)} required />
        </div>
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="btn primary">Create Account</button>
        <div style={{ color: "#334155" }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}