import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiArrowLeft } from "react-icons/fi";

export default function PersonalInfo() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  if (!user) {
    return (
      <div className="page">
        <div className="pageHeader">
          <button className="backBtn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
          <h1 className="pageTitle">Personal Information</h1>
        </div>
        <div className="empty">Please login to view and edit your information.</div>
      </div>
    );
  }

  const [firstName, setFirstName] = useState(() => (user.name || "").split(/\s+/)[0] || "");
  const [lastName, setLastName] = useState(() => (user.name || "").split(/\s+/).slice(1).join(" "));
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [address, setAddress] = useState(user.address || "");
  const [aadhaar, setAadhaar] = useState(user.aadhaar || "");

  function handleSave(e) {
    e.preventDefault();
    const nextName = [firstName, lastName].filter(Boolean).join(" ").trim();
    updateUser({ name: nextName, email, phone, address, aadhaar });
    alert("Personal information updated.");
    navigate("/settings");
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h1 className="pageTitle">Personal Information</h1>
      </div>

      <div className="formCard">
        <form onSubmit={handleSave} className="issueForm" style={{ gap: 16 }}>
          <div className="grid2">
            <div className="field">
              <label>First Name</label>
              <input type="text" value={firstName} onChange={(e)=>setFirstName(e.target.value)} required />
            </div>
            <div className="field">
              <label>Last Name</label>
              <input type="text" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
            </div>
          </div>
          <div className="grid2">
            <div className="field">
              <label>Email</label>
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label>Phone Number</label>
              <input type="text" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="e.g., 98765 43210" />
            </div>
          </div>
          <div className="field">
            <label>Address</label>
            <input type="text" value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="House no, street, area, city, state" />
          </div>
          <div className="field">
            <label>Aadhaar Number</label>
            <input type="text" value={aadhaar} onChange={(e)=>setAadhaar(e.target.value)} placeholder="XXXX-XXXX-XXXX" />
          </div>
          <div>
            <button type="submit" className="btn primary">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
}


