import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalHeatLoadDashboard() {
  const { projectData, designResult } = useProject();

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Heat Load Dashboard</h1>

      <p style={styles.subHeading}>
        Heat Load is fully automatic. Construction selection is controlled from Project Input.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Design Cooling Load" value={designResult.designTR} unit="TR" />
        <SummaryBox label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
        <SummaryBox label="Total Heat Load" value={designResult.totalWatts} unit="W" />
        <SummaryBox label="Room Volume" value={designResult.volume} unit="m³" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Input Summary From Project Input</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Room Length" value={projectData.roomLength} unit="m" />
          <ResultBox label="Room Width" value={projectData.roomWidth} unit="m" />
          <ResultBox label="Room Height" value={projectData.roomHeight} unit="m" />
          <ResultBox label="People Count" value={projectData.peopleCount} unit="Nos" />
          <ResultBox label="Lighting Load" value={projectData.lightingLoad} unit="W" />
          <ResultBox label="Equipment Load" value={projectData.equipmentLoad} unit="W" />
          <ResultBox label="Indoor Temperature" value={projectData.indoorTemp} unit="°C" />
          <ResultBox label="Outdoor Temperature" value={projectData.outdoorTemp} unit="°C" />
          <ResultBox label="Fresh Air" value={designResult.freshAirCFM} unit="CFM" />
          <ResultBox label="Wall U Value" value={projectData.wallU} unit="W/m²K" />
          <ResultBox label="Roof U Value" value={projectData.roofU} unit="W/m²K" />
          <ResultBox label="Glass U Value" value={projectData.glassU} unit="W/m²K" />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Heat Load Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Room Volume" value={designResult.volume} unit="m³" />
          <ResultBox label="Floor Area" value={designResult.floorArea} unit="m²" />
          <ResultBox label="Wall Area" value={designResult.wallArea} unit="m²" />
          <ResultBox label="Roof Area" value={designResult.roofArea} unit="m²" />
          <ResultBox label="Fresh Air" value={designResult.freshAirCFM} unit="CFM" />
          <ResultBox label="Total Sensible Load" value={designResult.totalSensible} unit="W" />
          <ResultBox label="Total Latent Load" value={designResult.totalLatent} unit="W" />
          <ResultBox label="Total Heat Load" value={designResult.totalWatts} unit="W" />
          <ResultBox label="Total Cooling Load" value={designResult.totalTR} unit="TR" />
          <ResultBox label="Design Cooling Load" value={designResult.designTR} unit="TR" />
          <ResultBox label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
        </div>
      </div>

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Engineering Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="T" meaning="Temperature" unit="°C" />
          <LegendItem symbol="RH" meaning="Relative Humidity" unit="%" />
          <LegendItem symbol="W" meaning="Watt" unit="W" />
          <LegendItem symbol="TR" meaning="Ton of Refrigeration" unit="TR" />
          <LegendItem symbol="CFM" meaning="Cubic Feet per Minute" unit="CFM" />
          <LegendItem symbol="U" meaning="Overall Heat Transfer Coefficient" unit="W/m²K" />
          <LegendItem symbol="A" meaning="Area" unit="m²" />
          <LegendItem symbol="V" meaning="Volume" unit="m³" />
          <LegendItem symbol="ΔT" meaning="Temperature Difference" unit="°C" />
        </div>
      </div>
    </div>
  );
}

function SummaryBox({ label, value, unit }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>{value} {unit}</strong>
    </div>
  );
}

function ResultBox({ label, value, unit }) {
  return (
    <div style={styles.resultBox}>
      <span>{label}</span>
      <strong>{value} {unit}</strong>
    </div>
  );
}

function LegendItem({ symbol, meaning, unit }) {
  return (
    <div style={styles.legendItem}>
      <strong style={styles.legendSymbol}>{symbol}</strong>
      <div>
        <div style={styles.legendMeaning}>{meaning}</div>
        <div style={styles.legendUnit}>Unit: {unit}</div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "10px" },
  subHeading: { fontSize: "18px", color: "#374151", marginBottom: "22px" },
  summaryCard: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  summaryBox: { background: "#111827", color: "white", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px" },
  sectionTitle: { fontSize: "23px", color: "#111827", marginTop: "10px", marginBottom: "18px", borderBottom: "2px solid #e60000", paddingBottom: "8px" },
  resultCard: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px" },
  resultHeading: { fontSize: "28px", color: "#111827", marginBottom: "20px" },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  resultBox: { background: "#f3f4f6", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" },
  legendCard: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
  legendHeading: { fontSize: "28px", fontWeight: "800", marginBottom: "20px", color: "#111827" },
  legendGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  legendItem: { background: "#f3f4f6", padding: "16px", borderRadius: "14px", display: "flex", gap: "14px", alignItems: "center" },
  legendSymbol: { fontSize: "24px", color: "#e60000", minWidth: "55px" },
  legendMeaning: { fontWeight: "700", color: "#111827" },
  legendUnit: { color: "#374151", marginTop: "4px" },
};