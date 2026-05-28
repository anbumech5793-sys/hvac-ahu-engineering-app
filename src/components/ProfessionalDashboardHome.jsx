import React from "react";

export default function ProfessionalDashboardHome() {
  return (
    <div style={styles.page}>
      <div style={styles.hero}>
        <h1 style={styles.title}>Professional HVAC AHU Design Suite</h1>
        <p style={styles.text}>
          Complete AHU workflow: project input, heat load, psychrometric, coil,
          blower, filter, duct, costing, report, export, validation, and settings.
        </p>
      </div>

      <div style={styles.grid}>
        {[
          "Project Input",
          "Heat Load",
          "Psychrometric",
          "Coil Selection",
          "Blower Selection",
          "Filter Selection",
          "Duct Sizing",
          "AHU Costing",
          "Project Report",
          "Export",
          "Validation",
          "Settings",
        ].map((item, index) => (
          <div key={item} style={styles.card}>
            <strong>Step {index + 1}</strong>
            <h3>{item}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },
  hero: {
    background: "white",
    borderRadius: "18px",
    padding: "30px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    marginBottom: "24px",
  },
  title: { fontSize: "36px", color: "#111827", marginTop: 0 },
  text: { fontSize: "18px", color: "#374151" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "18px",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    padding: "22px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    borderLeft: "6px solid #e60000",
  },
};