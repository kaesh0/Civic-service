import React, { useMemo } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function MyTickets() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const allReports = JSON.parse(localStorage.getItem("reports") || "[]");
  const myReports = useMemo(() => {
    if (!user) return allReports.filter((r) => r.ownerId === "guest");
    return allReports.filter((r) => r.ownerId === user.id);
  }, [allReports, user]);

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate("/profile")}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">My Tickets</h1>
      </div>

      <div className="ticketsContainer">
        {myReports.length === 0 ? (
          <div className="empty">No tickets yet.</div>
        ) : (
          <div className="reportsGrid">
            {myReports.map((r) => (
              <div key={r.id} className="reportCard">
                <div className="reportImage">
                  {r.media ? (
                    r.media.startsWith("data:video") ? 
                      <video src={r.media} controls /> : 
                      <img src={r.media} alt={r.fileName || "media"} />
                  ) : (
                    <div className="placeholderImage">📷</div>
                  )}
                </div>
                <div className="reportContent">
                  <div className="reportTitle">{r.title}</div>
                  <div className="reportDate">{formatDate(r.createdAt)}</div>
                  <div className="reportCategory">{r.category}</div>
                </div>
                <div className={`reportStatus ${r.status.toLowerCase().replace(' ', '')}`}>
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}









