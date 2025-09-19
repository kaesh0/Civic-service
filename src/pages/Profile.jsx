import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { deriveBadges } from "../utils/badges.js";
import { FiUser, FiFileText, FiUsers, FiSettings, FiLogOut, FiChevronRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const allReports = JSON.parse(localStorage.getItem("reports") || "[]");
  const myReports = useMemo(() => {
    if (!user) return allReports.filter((r) => r.ownerId === "guest");
    return allReports.filter((r) => r.ownerId === user.id);
  }, [allReports, user]);

  const stateWise = useMemo(() => {
    const counts = {};
    for (const r of myReports) {
      const state = r?.manualLocation?.state?.trim() || "Unknown";
      if (!counts[state]) counts[state] = { Submitted: 0, Inprogress: 0, Resolved: 0, total: 0 };
      const key = (r.status || "Submitted").replace(/\s+/g, "");
      if (key === "Resolved") counts[state].Resolved += 1; else if (key.toLowerCase() === "inprogress" || key === "Inprogress") counts[state].Inprogress += 1; else counts[state].Submitted += 1;
      counts[state].total += 1;
    }
    return counts;
  }, [myReports]);

  // recompute badges for logged user
  if (user) {
    const nextBadges = deriveBadges(user.points || 0);
    if (JSON.stringify(nextBadges) !== JSON.stringify(user.badges || [])) {
      updateUser({ badges: nextBadges });
    }
  }

  function updateStatus(id, nextStatus) {
    const next = allReports.map((r) => {
      if (r.id !== id) return r;
      const updated = { ...r, status: nextStatus };
      // reward resolution once
      if (nextStatus === "Resolved" && user && !r.resolvedRewarded) {
        updateUser({ points: (user.points || 0) + 20 });
        updated.resolvedRewarded = true;
      }
      return updated;
    });
    localStorage.setItem("reports", JSON.stringify(next));
    // trigger refresh
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div className="page profilePage">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate(-1)} aria-label="Go back">←</button>
        <h1 className="pageTitle">Profile</h1>
      </div>
      
      {/* 9:16 Aspect Ratio Container */}
      <div className="profile-aspect-container">
        <div className="profileContainer">
          {/* Profile Header */}
          <div className="profileHeader">
            <div className="profileAvatar">
              <span className="avatarInitials">{(user && user.name) ? user.name.split(/\s+/).filter(Boolean).slice(0,2).map(p => p[0].toUpperCase()).join('') : 'JD'}</span>
            </div>
            <div className="profileDetails">
              <h2 className="profileName">{user ? user.name : "John Doe"}</h2>
              <p className="profileEmail">{user ? user.email : "john.doe@example.com"}</p>
            </div>
            <button className="btn edit-profile-btn" onClick={() => navigate("/settings/personal-info")}>Edit Profile</button>
          </div>

          {/* Centered Navigation Options directly below header */}
          <div className="profileOptionsCentered">
            <button type="button" className="profileOptionButton" onClick={() => navigate("/my-tickets")}>
              <div className="menuItemLeft">
                <FiFileText className="menuIcon" />
                <span className="menuText">My Tickets</span>
              </div>
              <FiChevronRight className="menuArrow" />
            </button>
            
            <button type="button" className="profileOptionButton" onClick={() => navigate("/community")}>
              <div className="menuItemLeft">
                <FiUsers className="menuIcon" />
                <span className="menuText">Community</span>
              </div>
              <FiChevronRight className="menuArrow" />
            </button>
            
            <button type="button" className="profileOptionButton" onClick={() => navigate("/settings")}>
              <div className="menuItemLeft">
                <FiSettings className="menuIcon" />
                <span className="menuText">Settings</span>
              </div>
              <FiChevronRight className="menuArrow" />
            </button>
            
            <button
              type="button"
              className="profileOptionButton logoutItem"
              onClick={() => {
                if (window.confirm('Are you sure you want to logout?')) {
                  logout();
                }
              }}
            >
              <div className="menuItemLeft">
                <FiLogOut className="menuIcon" />
                <span className="menuText">Logout</span>
              </div>
              <FiChevronRight className="menuArrow" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}