import React, { useState } from "react";
import { formatFieldLabel } from "../utils/hvacFieldMeta";

export default function ProfessionalDesignBasisDashboard() {
  const [form, setForm] = useState({
    projectName: "",
    clientName: "",
    location: "",
    application: "Pharmaceutical AHU",
    designStandard: "ASHRAE / ISHRAE",
    roomTemperature: "24",
    relativeHumidity: "55",
    freshAirPercent: "10",
    filtration: "Pre Filter + Fine Filter + HEPA",
    construction: "Double Skin AHU",
    coilType: "Chilled Water Cooling Coil",
    powerSupply: "415V / 3 Phase / 50Hz",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Design Basis Dashboard</h1>
      <p style={styles.subText}>
        Enter basic project and AHU design reference details.
      </p>

      <div style={styles.card}>
        <div style={styles.grid}>
          {Object.entries(form).map(([key, value]) => (
            <div key={key} style={styles.field}>
              <label style={styles.label}>{formatFieldLabel(key)}</label>
              <input
                name={key}
                value={value}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          ))}
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultTitle}>Design Basis Summary</h2>

        {Object.entries(form).map(([key, value]) => (
          <div key={key} style={styles.row}>
            <strong>{formatFieldLabel(key)}</strong>
            <span>{value || "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

const styles = {
  page: {
    background: "#f8fafc",
    minHeight: "100vh",
  },
  heading: {
    fontSize: "34px",
    color: "#0f172a",
    marginBottom: "6px",
  },
  subText: {
    color: "#64748b",
    marginBottom: "20px",
  },
  card: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "700",
    color: "#334155",
    marginBottom: "6px",
  },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  resultCard: {
    background: "white",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
  },
  resultTitle: {
    color: "#1e3a8a",
    marginTop: 0,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 0",
    gap: "20px",
  },
};