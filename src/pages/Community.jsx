import React, { useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

function formatDate(iso) {
  try { return new Date(iso).toLocaleString(); } catch { return iso; }
}

export default function Community() {
  const navigate = useNavigate();
  const [communityTab, setCommunityTab] = useState("category");
  const allReports = JSON.parse(localStorage.getItem("reports") || "[]");
  const demoReports = [
    {
      id: "demo-1",
      title: "Pothole near school gate",
      category: "Road",
      createdAt: new Date().toISOString(),
      media: "https://images.unsplash.com/photo-1602532643899-5f1f4c1b9e0d?q=80&w=1200&auto=format&fit=crop",
      fileName: "pothole.jpg",
      status: "Submitted",
      priority: "Medium",
      manualLocation: { state: "Maharashtra", district: "Pune", city: "Pimpri-Chinchwad", address: "Sector 12" }
    },
    {
      id: "demo-2",
      title: "Overflowing garbage bin",
      category: "Garbage",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      media: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?q=80&w=1200&auto=format&fit=crop",
      fileName: "garbage.jpg",
      status: "In Progress",
      priority: "High",
      manualLocation: { state: "Karnataka", district: "Bengaluru Urban", city: "Bengaluru", address: "MG Road" }
    },
    {
      id: "demo-3",
      title: "Streetlight not working",
      category: "Streetlight",
      createdAt: new Date(Date.now() - 2*86400000).toISOString(),
      media: "https://images.unsplash.com/photo-1502489619531-7a63131b8746?q=80&w=1200&auto=format&fit=crop",
      fileName: "streetlight.jpg",
      status: "Resolved",
      priority: "Low",
      manualLocation: { state: "Delhi", district: "New Delhi", city: "New Delhi", address: "Karol Bagh" }
    }
  ];

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate("/profile")}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">Community</h1>
      </div>

      <div className="communityContainer">
        <div className="tabs">
          <button
            className={`tab ${communityTab === 'category' ? 'active' : ''}`}
            onClick={() => setCommunityTab('category')}
          >Category</button>
          <button
            className={`tab ${communityTab === 'status' ? 'active' : ''}`}
            onClick={() => setCommunityTab('status')}
          >Status</button>
        </div>

        {communityTab === 'category' ? (
          <ul className="categoryList">
            {(allReports.length === 0 ? demoReports : allReports).map((r) => {
              const loc = r?.manualLocation ? `${r.manualLocation.state}${r.manualLocation.city ? `, ${r.manualLocation.city}` : ''}` : '';
              return (
                <li key={r.id} className="categoryItem">
                  <div className="categoryLeft">
                    <div className="categoryThumb">
                      {r.media ? (
                        r.media.startsWith('data:video') ? (
                          <video src={r.media} />
                        ) : (
                          <img src={r.media} alt={r.fileName || 'media'} />
                        )
                      ) : (
                        <div className="placeholderImage">📷</div>
                      )}
                    </div>
                    <div className="categoryText">
                      <div className="categoryTitle">{r.title}</div>
                      <div className="categoryMeta">
                        {r.category}{loc ? ` • ${loc}` : ''} • {formatDate(r.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className={`reportStatus ${String(r.status || '').toLowerCase().replace(/\s+/g,'')}`}>{r.status || 'Submitted'}</div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="statusWrap">
            <div className="statusSummary">
              <div className="statusChip submitted">Submitted: {allReports.filter(r=>r.status==='Submitted').length}</div>
              <div className="statusChip inprogress">In Progress: {allReports.filter(r=>r.status==='In Progress').length}</div>
              <div className="statusChip resolved">Resolved: {allReports.filter(r=>r.status==='Resolved').length}</div>
            </div>
            <div className="statusLists">
              {['Submitted','In Progress','Resolved'].map((s) => (
                <div key={s} className="statusGroup">
                  <div className="statusTitle">{s}</div>
                  {allReports.filter(r=>r.status===s).length === 0 ? (
                    <div className="empty" style={{marginTop:8}}>No items.</div>
                  ) : (
                    <ul className="ticketList">
                      {allReports.filter(r=>r.status===s).map((r) => (
                        <li key={r.id} className="ticketItem">
                          <div className="ticketMain">
                            <div className="ticketTitle">{r.title}</div>
                            <div className={`statusBadge`}>{r.priority}</div>
                          </div>
                          <div className="ticketMeta">
                            <span>{r.category}</span><span>•</span><span>{formatDate(r.createdAt)}</span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}









