import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { FiArrowLeft, FiUser, FiBell, FiShield, FiHelpCircle, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate("/");
    }
  };

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate("/profile")}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">Settings</h1>
      </div>

      <div className="settingsContainer">
        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Account</h3>
          <div className="settingsMenu">
            <div className="settingsItem" onClick={() => navigate("/settings/personal-info")}>
              <div className="settingsItemLeft">
                <FiUser className="settingsIcon" />
                <span className="settingsText">Personal Information</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
            
            <div className="settingsItem" onClick={() => navigate("/settings/privacy-security")}>
              <div className="settingsItemLeft">
                <FiShield className="settingsIcon" />
                <span className="settingsText">Privacy & Security</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          </div>
        </div>

        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Notifications</h3>
          <div className="settingsMenu">
            <div className="settingsItem" onClick={() => navigate("/settings/notifications")}>
              <div className="settingsItemLeft">
                <FiBell className="settingsIcon" />
                <span className="settingsText">Push Notifications</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          </div>
        </div>

        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Support</h3>
          <div className="settingsMenu">
            <div className="settingsItem" onClick={() => navigate("/help") }>
              <div className="settingsItemLeft">
                <FiHelpCircle className="settingsIcon" />
                <span className="settingsText">Help Center</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
            
            <div className="settingsItem">
              <div className="settingsItemLeft">
                <FiInfo className="settingsIcon" />
                <span className="settingsText">About</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          </div>
        </div>

        <div className="settingsSection">
          <div className="settingsMenu">
            <div className="settingsItem logoutItem" onClick={handleLogout}>
              <div className="settingsItemLeft">
                <FiUser className="settingsIcon" />
                <span className="settingsText">Logout</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}









