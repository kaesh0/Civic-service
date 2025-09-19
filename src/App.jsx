import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import Welcome from "./pages/Welcome.jsx";
import Home from "./pages/Home.jsx";
import Report from "./pages/Report.jsx";
import Profile from "./pages/Profile.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Community from "./pages/Community.jsx";
import Settings from "./pages/Settings.jsx";
import PersonalInfo from "./pages/PersonalInfo.jsx";
import PrivacySecurity from "./pages/PrivacySecurity.jsx";
import Help from "./pages/Help.jsx";
import Helpline from "./pages/Helpline.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FiHome, FiUser, FiFilePlus, FiAward } from "react-icons/fi";

function Shell() {
  return (
    <div className="appContainer">
      <main className="mainContent">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/home" element={<Home />} />
          <Route path="/report" element={<Report />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-tickets" element={<MyTickets />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/settings/personal-info" element={<PersonalInfo />} />
          <Route path="/settings/privacy-security" element={<PrivacySecurity />} />
          <Route path="/help" element={<Help />} />
          <Route path="/helpline" element={<Helpline />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>

      <nav className="tabbar">
        <NavLink to="/home" className={({ isActive }) => `tabItem ${isActive ? 'active' : ''}`}>
          <FiHome />
          <span>Home</span>
        </NavLink>
        <NavLink to="/report" className={({ isActive }) => `tabItem primary ${isActive ? 'active' : ''}`}>
          <FiFilePlus />
          <span>Report</span>
        </NavLink>
        <NavLink to="/leaderboard" className={({ isActive }) => `tabItem ${isActive ? 'active' : ''}`}>
          <FiAward />
          <span>Rank</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `tabItem ${isActive ? 'active' : ''}`}>
          <FiUser />
          <span>Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Shell />
    </AuthProvider>
  );
}