import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiBell } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const DEFAULT_PREFS = {
  announcements: true,
  statusUpdates: true,
  comments: true,
  nearbyIssues: false,
};

export default function Notifications() {
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("notificationPrefs") || "null") || DEFAULT_PREFS;
    } catch {
      return DEFAULT_PREFS;
    }
  });
  const [permission, setPermission] = useState(Notification?.permission || "default");

  useEffect(() => {
    localStorage.setItem("notificationPrefs", JSON.stringify(prefs));
  }, [prefs]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }
    try {
      const p = await Notification.requestPermission();
      setPermission(p);
    } catch {
      // ignore
    }
  };

  const toggle = (key) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">Push Notifications</h1>
      </div>

      <div className="settingsContainer">
        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Permissions</h3>
          <div className="settingsMenu">
            <div className="settingsItem" onClick={requestPermission}>
              <div className="settingsItemLeft">
                <FiBell className="settingsIcon" />
                <span className="settingsText">Browser Permission</span>
              </div>
              <span className="settingsArrow" style={{ color: permission === 'granted' ? '#059669' : permission === 'denied' ? '#ef4444' : 'var(--muted)' }}>
                {permission}
              </span>
            </div>
          </div>
        </div>

        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Notification Types</h3>
          <div className="settingsMenu">
            <label className="settingsItem" style={{ cursor: 'pointer' }}>
              <div className="settingsItemLeft">
                <span className="settingsText">Announcements</span>
              </div>
              <input type="checkbox" checked={!!prefs.announcements} onChange={() => toggle('announcements')} />
            </label>

            <label className="settingsItem" style={{ cursor: 'pointer' }}>
              <div className="settingsItemLeft">
                <span className="settingsText">Ticket Status Updates</span>
              </div>
              <input type="checkbox" checked={!!prefs.statusUpdates} onChange={() => toggle('statusUpdates')} />
            </label>

            <label className="settingsItem" style={{ cursor: 'pointer' }}>
              <div className="settingsItemLeft">
                <span className="settingsText">Comments on My Reports</span>
              </div>
              <input type="checkbox" checked={!!prefs.comments} onChange={() => toggle('comments')} />
            </label>

            <label className="settingsItem" style={{ cursor: 'pointer' }}>
              <div className="settingsItemLeft">
                <span className="settingsText">Nearby Issues</span>
              </div>
              <input type="checkbox" checked={!!prefs.nearbyIssues} onChange={() => toggle('nearbyIssues')} />
            </label>
          </div>
        </div>

        <div className="settingsSection">
          <h3 className="settingsSectionTitle">Test</h3>
          <div className="settingsMenu">
            <div className="settingsItem" onClick={() => {
              if (Notification?.permission === 'granted') {
                new Notification('Test Notification', { body: 'This is how your notifications will appear.' });
              } else {
                alert('Enable permission first to preview notifications.');
              }
            }}>
              <div className="settingsItemLeft">
                <FiBell className="settingsIcon" />
                <span className="settingsText">Send Test Notification</span>
              </div>
              <span className="settingsArrow">›</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



