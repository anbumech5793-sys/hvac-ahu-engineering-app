import React, { useState } from "react";
import { formatFieldLabel } from "../utils/hvacFieldMeta";

import {
  generateAHUGA,
} from "../engines/ProfessionalAHUGAEngine";

export default function ProfessionalAHUGADashboard() {
  const [form, setForm] = useState({
    airFlowCFM: 5000,
    coolingTR: 15,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const generateGA = () => {
    const output =
      generateAHUGA(form);

    setResult(output);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>
        Professional AHU GA & BOM Dashboard
      </h1>

      <p style={styles.subHeading}>
        Generate AHU sectional layout and BOM
      </p>

      <div style={styles.card}>
        <div style={styles.grid}>
          {Object.entries(form).map(([key, value]) => (
            <div key={key} style={styles.inputGroup}>
              <label style={styles.label}>
                {formatFieldLabel(key)}
              </label>

              <input
                type="number"
                name={key}
                value={value}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          ))}
        </div>

        <button
          onClick={generateGA}
          style={styles.button}
        >
          Generate AHU GA
        </button>
      </div>

      {result && (
        <>
          <div style={styles.resultCard}>
            <h2 style={styles.resultHeading}>
              AHU Overall Dimensions
            </h2>

            <div style={styles.resultGrid}>
              <ResultBox
                label="AHU Length"
                value={`${result.baseLength} mm`}
              />

              <ResultBox
                label="AHU Width"
                value={`${result.baseWidth} mm`}
              />

              <ResultBox
                label="AHU Height"
                value={`${result.baseHeight} mm`}
              />

              <ResultBox
                label="Casing Area"
                value={`${result.casingArea} m²`}
              />

              <ResultBox
                label="Insulation Area"
                value={`${result.insulationArea} m²`}
              />

              <ResultBox
                label="Frame Weight"
                value={`${result.frameWeight} kg`}
              />

              <ResultBox
                label="Sheet Weight"
                value={`${result.sheetWeight} kg`}
              />
            </div>
          </div>

          <div style={styles.resultCard}>
            <h2 style={styles.resultHeading}>
              AHU Section Layout
            </h2>

            <div style={styles.sectionRow}>
              {result.sections.map((section) => (
                <div
                  key={section.name}
                  style={styles.sectionBox}
                >
                  <strong>
                    {section.name}
                  </strong>

                  <p>
                    {section.length} mm
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div style={styles.resultCard}>
            <h2 style={styles.resultHeading}>
              Basic BOM
            </h2>

            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Item</th>
                  <th style={styles.th}>Quantity</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td style={styles.td}>
                    GI Sheet
                  </td>

                  <td style={styles.td}>
                    {result.sheetWeight} kg
                  </td>
                </tr>

                <tr>
                  <td style={styles.td}>
                    Insulation
                  </td>

                  <td style={styles.td}>
                    {result.insulationArea} m²
                  </td>
                </tr>

                <tr>
                  <td style={styles.td}>
                    Base Frame
                  </td>

                  <td style={styles.td}>
                    {result.frameWeight} kg
                  </td>
                </tr>

                <tr>
                  <td style={styles.td}>
                    Filter Set
                  </td>

                  <td style={styles.td}>
                    1 Set
                  </td>
                </tr>

                <tr>
                  <td style={styles.td}>
                    Cooling Coil
                  </td>

                  <td style={styles.td}>
                    1 No
                  </td>
                </tr>

                <tr>
                  <td style={styles.td}>
                    Centrifugal Fan
                  </td>

                  <td style={styles.td}>
                    1 No
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function ResultBox({ label, value }) {
  return (
    <div style={styles.resultBox}>
      <span style={styles.resultLabel}>
        {label}
      </span>

      <strong style={styles.resultValue}>
        {value}
      </strong>
    </div>
  );
}

function formatLabel(text) {
  return text
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

const styles = {
  page: {
    minHeight: "100vh",
  },

  heading: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },

  subHeading: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "25px",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontWeight: "700",
    marginBottom: "8px",
    color: "#111827",
  },

  input: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },

  button: {
    marginTop: "30px",
    background: "#e60000",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "14px",
    padding: "16px 24px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
  },

  resultCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },

  resultHeading: {
    fontSize: "28px",
    marginBottom: "20px",
    color: "#111827",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  resultBox: {
    background: "#f3f4f6",
    padding: "16px",
    borderRadius: "14px",
  },

  resultLabel: {
    display: "block",
    marginBottom: "6px",
    color: "#374151",
  },

  resultValue: {
    color: "#111827",
    fontSize: "18px",
  },

  sectionRow: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
  },

  sectionBox: {
    background: "#fee2e2",
    border: "2px solid #e60000",
    padding: "20px",
    borderRadius: "14px",
    minWidth: "180px",
    textAlign: "center",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
  },
};