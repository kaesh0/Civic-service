import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiPhone } from "react-icons/fi";

export default function Helpline() {
  const navigate = useNavigate();

  return (
    <div className="page">
      <div className="pageHeader">
        <button className="backBtn" onClick={() => navigate(-1)}>
          <FiArrowLeft />
        </button>
        <h1 className="pageTitle">Helpline Numbers</h1>
      </div>

      <section className="helpSection">
        <h2 className="sectionTitle">
          <FiPhone className="sectionIcon" />
          Emergency Services
        </h2>
        <div className="resourcesGrid">
          <div className="resourceCard" style={{ textAlign: "left" }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Police: <strong>100</strong></li>
              <li>Fire Brigade: <strong>101</strong></li>
              <li>Ambulance: <strong>102</strong></li>
              <li>Women Helpline: <strong>1091</strong></li>
              <li>Child Helpline: <strong>1098</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="helpSection">
        <h2 className="sectionTitle">
          <FiPhone className="sectionIcon" />
          Civic & Utilities
        </h2>
        <div className="resourcesGrid">
          <div className="resourceCard" style={{ textAlign: "left" }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Electricity Complaints: <strong>1912</strong></li>
              <li>Gas Leakage: <strong>1906</strong></li>
              <li>Water Supply Issues: <strong>1916</strong></li>
              <li>Municipal Corporation: <strong>1800-XXX-XXXX</strong></li>
              <li>Road & Transport: <strong>1800-XXX-XXXX</strong></li>
            </ul>
          </div>
        </div>
      </section>

      <section className="helpSection">
        <h2 className="sectionTitle">
          <FiPhone className="sectionIcon" />
          Citizen Services
        </h2>
        <div className="resourcesGrid">
          <div className="resourceCard" style={{ textAlign: "left" }}>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              <li>Citizen Call Center: <strong>1800-XXX-XXXX</strong></li>
              <li>Public Grievances: <strong>1800-XXX-XXXX</strong></li>
              <li>RTI Helpdesk: <strong>1800-XXX-XXXX</strong></li>
              <li>Health Helpline: <strong>1075</strong></li>
            </ul>
          </div>
        </div>
        <p style={{ color: "var(--muted)", marginTop: 12 }}>
          Numbers may vary by state/municipality. For non-emergency issues, please use the appropriate department line during working hours.
        </p>
      </section>
    </div>
  );
}


