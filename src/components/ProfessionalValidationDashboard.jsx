import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalValidationDashboard() {
  const { projectData, designResult } = useProject();

  const checks = [
    checkValue("Room Length", projectData.roomLength, "m", 1, 100),
    checkValue("Room Width", projectData.roomWidth, "m", 1, 100),
    checkValue("Room Height", projectData.roomHeight, "m", 2, 8),
    checkValue("People Count", projectData.peopleCount, "Nos", 0, 500),

    checkValue("Indoor DBT", designResult.indoorDBT, "°C", 18, 28),
    checkValue("Outdoor DBT", designResult.outdoorDBT, "°C", 25, 50),
    checkValue("Indoor RH", designResult.indoorRH, "%", 30, 70),
    checkValue("Outdoor RH", designResult.outdoorRH, "%", 20, 90),

    checkValue("Indoor Humidity Ratio", designResult.indoorHumidityRatio, "g/kg", 4, 18),
    checkValue("Outdoor Humidity Ratio", designResult.outdoorHumidityRatio, "g/kg", 5, 30),
    checkValue("Indoor Enthalpy", designResult.indoorEnthalpy, "kJ/kg", 25, 75),
    checkValue("Outdoor Enthalpy", designResult.outdoorEnthalpy, "kJ/kg", 35, 120),
    checkValue("Indoor Dew Point", designResult.indoorDewPoint, "°C", 5, 25),

    checkValue("Fresh Air", designResult.freshAirCFM, "CFM", 0, 50000),
    checkValue("Fresh Air Sensible Load", designResult.freshAirSensible, "W", 0, 500000),
    checkValue("Fresh Air Latent Load", designResult.freshAirLatent, "W", 0, 500000),

    checkValue("Total Sensible Load", designResult.totalSensible, "W", 100, 1000000),
    checkValue("Total Latent Load", designResult.totalLatent, "W", 0, 1000000),
    checkValue("Total Heat Load", designResult.totalWatts, "W", 100, 1500000),
    checkValue("Design Cooling Load", designResult.designTR, "TR", 0.5, 500),
    checkValue("Required Air Flow", designResult.requiredCFM, "CFM", 100, 200000),

    checkValue("SHR", designResult.SHR, "-", 0.55, 0.95),
    checkValue("ACH", designResult.roomACH, "1/hr", 2, 80),

    checkValue("Coil Capacity", designResult.coilKW, "kW", 1, 2000),
    checkValue("Chilled Water Flow", designResult.chilledWaterFlowLPM, "LPM", 1, 50000),

    checkValue("AHU Length", designResult.ahuLength, "mm", 1000, 30000),
    checkValue("AHU Width", designResult.ahuWidth, "mm", 500, 10000),
    checkValue("AHU Height", designResult.ahuHeight, "mm", 500, 10000),
  ];

  const passed = checks.filter((item) => item.status === "PASS").length;
  const warnings = checks.filter((item) => item.status === "WARNING").length;
  const failed = checks.filter((item) => item.status === "FAIL").length;

  const overallStatus =
    failed > 0 ? "FAILED" : warnings > 0 ? "WARNING" : "PASSED";

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Automatic Validation Dashboard</h1>

      <p style={styles.subHeading}>
        Automatically validates HVAC AHU inputs, psychrometric outputs, heat load,
        SHR, ACH, coil data, chilled water flow, CFM and AHU sizing.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Overall Status" value={overallStatus} />
        <SummaryBox label="Passed Checks" value={passed} />
        <SummaryBox label="Warnings" value={warnings} />
        <SummaryBox label="Failed Checks" value={failed} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Automatic Engineering Validation Checklist</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Parameter</th>
              <th style={styles.th}>Value</th>
              <th style={styles.th}>Expected Range</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Remark</th>
            </tr>
          </thead>

          <tbody>
            {checks.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{item.name}</td>

                <td style={styles.td}>
                  {item.value} {item.unit}
                </td>

                <td style={styles.td}>
                  {item.min} - {item.max} {item.unit}
                </td>

                <td
                  style={{
                    ...styles.td,
                    fontWeight: "800",
                    color:
                      item.status === "PASS"
                        ? "#16a34a"
                        : item.status === "WARNING"
                        ? "#f59e0b"
                        : "#dc2626",
                  }}
                >
                  {item.status}
                </td>

                <td style={styles.td}>{item.remark}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Validated Engineering Summary</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Design Cooling Load" value={designResult.designTR} unit="TR" />
          <ResultBox label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
          <ResultBox label="SHR" value={designResult.SHR} unit="-" />
          <ResultBox label="ACH" value={designResult.roomACH} unit="1/hr" />
          <ResultBox label="Indoor Humidity Ratio" value={designResult.indoorHumidityRatio} unit="g/kg" />
          <ResultBox label="Indoor Enthalpy" value={designResult.indoorEnthalpy} unit="kJ/kg" />
          <ResultBox label="Coil Capacity" value={designResult.coilKW} unit="kW" />
          <ResultBox label="Chilled Water Flow" value={designResult.chilledWaterFlowLPM} unit="LPM" />
        </div>
      </div>
    </div>
  );
}

function checkValue(name, rawValue, unit, min, max) {
  const value = Number(rawValue);

  if (
    rawValue === "" ||
    rawValue === undefined ||
    rawValue === null ||
    Number.isNaN(value)
  ) {
    return {
      name,
      value: "-",
      unit,
      min,
      max,
      status: "FAIL",
      remark: "Missing or invalid value",
    };
  }

  if (value < min || value > max) {
    return {
      name,
      value,
      unit,
      min,
      max,
      status: "WARNING",
      remark: "Outside normal engineering range. Verify project condition.",
    };
  }

  return {
    name,
    value,
    unit,
    min,
    max,
    status: "PASS",
    remark: "Within acceptable engineering range",
  };
}

function SummaryBox({ label, value }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ResultBox({ label, value, unit }) {
  return (
    <div style={styles.resultBox}>
      <span>{label}</span>
      <strong>
        {value} {unit}
      </strong>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },

  heading: {
    fontSize: "40px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "10px",
  },

  subHeading: {
    fontSize: "18px",
    color: "#374151",
    marginBottom: "22px",
  },

  summaryCard: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },

  summaryBox: {
    background: "#111827",
    color: "white",
    borderRadius: "18px",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
    overflowX: "auto",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
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

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  resultBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
};