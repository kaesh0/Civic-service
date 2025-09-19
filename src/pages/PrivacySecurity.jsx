import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { FiArrowLeft } from "react-icons/fi";

export default function PrivacySecurity() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();

  const [remembered, setRemembered] = useState(() => Boolean(localStorage.getItem("user")));
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleRememberToggle(e) {
    const next = e.target.checked;
    setRemembered(next);
    if (!user) return;
    if (next) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    if (!user) return alert("Please login.");
    if (!currentPassword || !newPassword) return alert("Please fill all password fields.");
    if (newPassword !== confirmPassword) return alert("New passwords do not match.");
    if (user.password !== currentPassword) return alert("Current password is incorrect.");

    updateUser({ password: newPassword });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    alert("Password updated successfully.");
  }

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate(-1)}><FiArrowLeft /></button>
        <h1 className="pageTitle">Privacy & Security</h1>
      </div>

      <div className="settingsContainer">
        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Saved Login</h3>
          <div className="switchRow">
            <span>Keep me signed in on this device</span>
            <label className="switch">
              <input type="checkbox" checked={remembered} onChange={handleRememberToggle} />
              <span className="slider" />
            </label>
          </div>
        </div>

        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Change Password</h3>
          {user ? (
            <form className="issueForm" onSubmit={handlePasswordChange} style={{ gap: 16 }}>
              <div className="grid2">
                <div className="field">
                  <label>Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} required />
                </div>
                <div className="field">
                  <label>New Password</label>
                  <input type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} required />
                </div>
              </div>
              <div className="field">
                <label>Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} required />
              </div>
              <div>
                <button type="submit" className="btn primary">Update Password</button>
              </div>
            </form>
          ) : (
            <div className="empty">Please login to change your password.</div>
          )}
        </div>
      </div>
    </div>
  );
}


