import React, { useEffect, useMemo, useState } from "react";
import IndiaMap from "../components/IndiaMap.jsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const CATEGORIES = [
  { key: "Road", label: "Road Issues", emoji: "🛣️" },
  { key: "Garbage", label: "Garbage & Waste", emoji: "🗑️" },
  { key: "Streetlight", label: "Streetlight", emoji: "💡" },
  { key: "Trees", label: "Trees", emoji: "🌳" },
  { key: "Pollution", label: "Pollution", emoji: "🏭" },
  { key: "Vandalism", label: "Vandalism", emoji: "🚫" },
  { key: "Water Leak", label: "Water Leak", emoji: "💧" },
  { key: "Graffiti", label: "Graffiti", emoji: "🖍️" },
  { key: "Other", label: "Other", emoji: "➕" }
];
const PRIORITIES = ["Low","Medium","High"];

export default function Report() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Road");
  const [priority, setPriority] = useState("Medium");
  const [anonymous, setAnonymous] = useState(false);
  const [location, setLocation] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [geoTried, setGeoTried] = useState(false);
  const [customCategory, setCustomCategory] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [useManualLocation, setUseManualLocation] = useState(false);
  const [manualState, setManualState] = useState("");
  const [manualDistrict, setManualDistrict] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualAddress, setManualAddress] = useState("");

  const isValid = useMemo(() => {
    const categoryOk = category === "Other" ? customCategory.trim() : category;
    const manualOk = useManualLocation && manualState.trim() && manualDistrict.trim() && manualCity.trim() && manualAddress.trim();
    const mapOk = !useManualLocation && location;
    return title.trim() && description.trim() && categoryOk && priority && (manualOk || mapOk);
  }, [title, description, category, customCategory, priority, location, useManualLocation, manualState, manualDistrict, manualCity, manualAddress]);

  // Try to auto-detect user's location once on mount
  useEffect(() => {
    if (geoTried || location) return;
    if (!navigator.geolocation) return setGeoTried(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Rough India bounds check
        const withinIndia = lat >= 6.46 && lat <= 35.52 && lng >= 68.10 && lng <= 97.40;
        if (withinIndia) setLocation([lat, lng]);
        setGeoTried(true);
      },
      () => setGeoTried(true),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, [geoTried, location]);

  function guessCategoryFromText(text) {
    if (!text) return [];
    const t = text.toLowerCase();
    const rules = [
      { kw: ["pothole","road","asphalt"], key: "Road" },
      { kw: ["garbage","trash","waste","bin"], key: "Garbage" },
      { kw: ["streetlight","light out","lamp"], key: "Streetlight" },
      { kw: ["tree","branch","fallen"], key: "Trees" },
      { kw: ["smog","smoke","pollution"], key: "Pollution" },
      { kw: ["vandal","broken","damage"], key: "Vandalism" },
      { kw: ["leak","water","pipe"], key: "Water Leak" },
      { kw: ["graffiti","paint","spray"], key: "Graffiti" }
    ];
    const found = new Set();
    for (const rule of rules) {
      if (rule.kw.some((k)=>t.includes(k))) found.add(rule.key);
    }
    return Array.from(found);
  }

  useEffect(() => {
    // Update suggestions as user types title/description
    const s = guessCategoryFromText(`${title} ${description}`);
    setSuggestions(s);
  }, [title, description]);

  function handleFile(e) {
    const f = e.target.files?.[0];
    setFile(f || null);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target.result);
      reader.readAsDataURL(f);
      const s = guessCategoryFromText(f.name || "");
      if (s.length) setSuggestions(s);
    } else {
      setPreview("");
    }
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!isValid) return;

    const reports = JSON.parse(localStorage.getItem("reports") || "[]");
    const newReport = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      title: title.trim(),
      description: description.trim(),
      category: category === "Other" ? customCategory.trim() : category,
      priority,
      anonymous,
      status: "Submitted",
      location,
      manualLocation: useManualLocation ? {
        state: manualState.trim(),
        district: manualDistrict.trim(),
        city: manualCity.trim(),
        address: manualAddress.trim()
      } : null,
      media: preview || "",
      fileName: file?.name || "",
      ownerId: user?.id || "guest",
      resolvedRewarded: false
    };
    localStorage.setItem("reports", JSON.stringify([newReport, ...reports]));

    // award submit points if logged in
    if (user) {
      const nextPoints = (user.points || 0) + 10;
      updateUser({ points: nextPoints });
    }

    navigate("/profile");
  }

  return (
    <div className="page">
      <h2 className="pageTitle">Report an Issue</h2>
      {!user && <div className="empty">Tip: Login to earn points and badges for your reports.</div>}

      <form className="formCard" onSubmit={onSubmit}>
        <div className="field">
          <label>Title</label>
          <input type="text" placeholder="Pothole" value={title} onChange={(e)=>setTitle(e.target.value)} required />
        </div>

        <div className="field">
          <label>Description</label>
          <textarea rows={4} placeholder="There’s a large pothole on 5th Street." value={description} onChange={(e)=>setDescription(e.target.value)} required />
        </div>

        <div className="field">
          <label>Category</label>
          <div className="categoryGrid">
            {CATEGORIES.map((c)=> (
              <button
                type="button"
                key={c.key}
                className={`categoryTile ${category===c.key ? 'selected' : ''}`}
                onClick={()=>setCategory(c.key)}
              >
                <div className="categoryIcon">{c.emoji}</div>
                <div className="categoryLabel">{c.label}</div>
              </button>
            ))}
          </div>
          {category === "Other" && (
            <div style={{ marginTop: 10 }}>
              <input
                type="text"
                placeholder="Describe your issue category"
                value={customCategory}
                onChange={(e)=>setCustomCategory(e.target.value)}
                required
                className="otherCategoryInput"
              />
              {!!suggestions.length && (
                <div className="suggestionsRow" style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ color: 'var(--muted)', fontSize: 12 }}>Suggestions:</span>
                  {suggestions.map((s) => (
                    <button key={s} type="button" className="suggestionChip" onClick={()=>setCustomCategory(s)}>{s}</button>
                  ))}
                </div>
              )}
              <div className="hint" style={{ color: 'var(--muted)', fontSize: 12, marginTop: 6 }}>
                Please enter a short category name.
              </div>
            </div>
          )}
        </div>

        <div className="field">
          <label>Priority Level</label>
          <div className="priorityRow">
            {PRIORITIES.map((p)=> (
              <label key={p} className={`priorityOption ${p.toLowerCase()} ${priority===p ? 'active' : ''}`}>
                <input type="radio" name="priority" value={p} checked={priority===p} onChange={()=>setPriority(p)} />
                <span className="dot" />
                <span className="text">{p}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="switchRow">
          <label>Report as Anonymous</label>
          <label className="switch">
            <input type="checkbox" checked={anonymous} onChange={(e)=>setAnonymous(e.target.checked)} />
            <span className="slider" />
          </label>
        </div>

        <div className="field">
          <label>Upload Image or Video</label>
          <input type="file" accept="image/*,video/*" onChange={handleFile} />
          {preview && (
            <div className="mediaPreview">
              {preview.startsWith("data:video") ? <video controls src={preview} /> : <img alt="preview" src={preview} />}
            </div>
          )}
        </div>

        <div className="field">
          <label>Location</label>
          <div className="switchRow" style={{ marginBottom: 10 }}>
            <span>Enter location manually</span>
            <label className="switch">
              <input type="checkbox" checked={useManualLocation} onChange={(e)=>setUseManualLocation(e.target.checked)} />
              <span className="slider" />
            </label>
          </div>
          {useManualLocation ? (
            <div style={{ display: 'grid', gap: 12 }}>
              <div className="grid2">
                <div className="field">
                  <label>State</label>
                  <input type="text" placeholder="e.g., Maharashtra" value={manualState} onChange={(e)=>setManualState(e.target.value)} required={useManualLocation} />
                </div>
                <div className="field">
                  <label>District</label>
                  <input type="text" placeholder="e.g., Pune" value={manualDistrict} onChange={(e)=>setManualDistrict(e.target.value)} required={useManualLocation} />
                </div>
              </div>
              <div className="grid2">
                <div className="field">
                  <label>City</label>
                  <input type="text" placeholder="e.g., Pimpri-Chinchwad" value={manualCity} onChange={(e)=>setManualCity(e.target.value)} required={useManualLocation} />
                </div>
                <div className="field">
                  <label>Specific Location</label>
                  <input type="text" placeholder="e.g., Near 5th Street, Sector 12" value={manualAddress} onChange={(e)=>setManualAddress(e.target.value)} required={useManualLocation} />
                </div>
              </div>
              <div className="hint" style={{ color: 'var(--muted)', fontSize: 12 }}>
                Tip: Provide clear landmarks to help authorities locate the issue.
              </div>
            </div>
          ) : (
            <IndiaMap value={location} onChange={setLocation} />
          )}
        </div>

        <button className="btn primary block" type="submit" disabled={!isValid}>Submit</button>
      </form>
    </div>
  );
}