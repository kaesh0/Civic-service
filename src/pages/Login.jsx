import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setUserType(type);
    }
  }, [searchParams]);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/home");
    } catch (e) {
      setErr(e.message);
    }
  }

  return (
    <div className="page">
      <h2 className="pageTitle">
        Login {userType && `as ${userType === 'citizen' ? 'Citizen' : 'Government Official'}`}
      </h2>
      {userType && (
        <div className="userTypeIndicator">
          {userType === 'citizen' ? '👤' : '🏛️'} 
          {userType === 'citizen' ? 'Citizen Portal' : 'Government Portal'}
        </div>
      )}
      <form className="formCard" onSubmit={onSubmit}>
        {err && <div className="empty" style={{ color: "#b91c1c", borderColor: "#fecaca" }}>{err}</div>}
        <div className="field">
          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
        </div>
        <button className="btn primary">Login</button>
        <div style={{ color: "#334155" }}>
          New here? <Link to="/signup">Create an account</Link>
        </div>
      </form>
    </div>
  );
}