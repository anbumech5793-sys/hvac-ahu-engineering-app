import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalCoilSelectionDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);
  const coilTR = Number(designResult.designTR || 0);
  const faceVelocity = Number(projectData.coilFaceVelocity || 2.5);
  const chilledWaterIn = Number(projectData.chilledWaterIn || 7);
  const chilledWaterOut = Number(projectData.chilledWaterOut || 12);

  const airFlowM3s = airFlowCFM * 0.000471947;
  const faceArea = airFlowM3s / faceVelocity;
  const coilHeight = Math.sqrt(faceArea / 1.5);
  const coilWidth = faceArea / coilHeight;

  const coilLoadKW = coilTR * 3.517;
  const waterDeltaT = chilledWaterOut - chilledWaterIn;
  const waterFlowLPM = (coilLoadKW * 860) / (waterDeltaT * 60);

  const rows = coilTR <= 10 ? 4 : coilTR <= 25 ? 6 : 8;
  const finSpacing = projectData.finSpacing || 12;
  const airPressureDrop = rows * 18;
  const waterPressureDrop = rows * 4;

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Coil Selection Dashboard</h1>

      <p style={styles.subHeading}>
        Coil selection is automatically calculated from master AHU airflow and cooling load.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Auto Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
        <SummaryBox label="Auto Coil Load" value={coilTR.toFixed(2)} unit="TR" />
        <SummaryBox label="Coil Face Area" value={faceArea.toFixed(2)} unit="m²" />
        <SummaryBox label="Water Flow" value={waterFlowLPM.toFixed(2)} unit="LPM" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Coil Design Inputs</h2>

        <div style={styles.grid}>
          <InputField
            label="Face Velocity"
            name="coilFaceVelocity"
            unit="m/s"
            value={projectData.coilFaceVelocity || 2.5}
            onChange={handleChange}
          />

          <InputField
            label="Chilled Water Inlet"
            name="chilledWaterIn"
            unit="°C"
            value={projectData.chilledWaterIn || 7}
            onChange={handleChange}
          />

          <InputField
            label="Chilled Water Outlet"
            name="chilledWaterOut"
            unit="°C"
            value={projectData.chilledWaterOut || 12}
            onChange={handleChange}
          />

          <InputField
            label="Fin Spacing"
            name="finSpacing"
            unit="FPI"
            value={projectData.finSpacing || 12}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Coil Selection Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
          <ResultBox label="Air Flow" value={airFlowM3s.toFixed(3)} unit="m³/s" />
          <ResultBox label="Coil Capacity" value={coilTR.toFixed(2)} unit="TR" />
          <ResultBox label="Coil Load" value={coilLoadKW.toFixed(2)} unit="kW" />
          <ResultBox label="Face Velocity" value={faceVelocity.toFixed(2)} unit="m/s" />
          <ResultBox label="Required Face Area" value={faceArea.toFixed(2)} unit="m²" />
          <ResultBox label="Recommended Coil Width" value={(coilWidth * 1000).toFixed(0)} unit="mm" />
          <ResultBox label="Recommended Coil Height" value={(coilHeight * 1000).toFixed(0)} unit="mm" />
          <ResultBox label="Coil Rows" value={rows} unit="Rows" />
          <ResultBox label="Fin Spacing" value={finSpacing} unit="FPI" />
          <ResultBox label="Water ΔT" value={waterDeltaT.toFixed(2)} unit="°C" />
          <ResultBox label="Chilled Water Flow" value={waterFlowLPM.toFixed(2)} unit="LPM" />
          <ResultBox label="Estimated Air Pressure Drop" value={airPressureDrop.toFixed(2)} unit="Pa" />
          <ResultBox label="Estimated Water Pressure Drop" value={waterPressureDrop.toFixed(2)} unit="kPa" />
        </div>
      </div>

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Engineering Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="CFM" meaning="Cubic Feet per Minute" unit="CFM" />
          <LegendItem symbol="TR" meaning="Ton of Refrigeration" unit="TR" />
          <LegendItem symbol="kW" meaning="Kilowatt" unit="kW" />
          <LegendItem symbol="FPI" meaning="Fins Per Inch" unit="FPI" />
          <LegendItem symbol="LPM" meaning="Litres Per Minute" unit="LPM" />
          <LegendItem symbol="ΔT" meaning="Temperature Difference" unit="°C" />
          <LegendItem symbol="Pa" meaning="Pascal Pressure Drop" unit="Pa" />
          <LegendItem symbol="m²" meaning="Face Area" unit="m²" />
          <LegendItem symbol="m/s" meaning="Face Velocity" unit="m/s" />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, unit, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>
        {label} ({unit})
      </label>

      <input
        type="number"
        name={name}
        value={value ?? ""}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
}

function SummaryBox({ label, value, unit }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>
        {value} {unit}
      </strong>
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
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "23px",
    color: "#111827",
    marginTop: "10px",
    marginBottom: "18px",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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
    background: "white",
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
    color: "#111827",
    marginBottom: "20px",
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

  legendCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  legendHeading: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "20px",
    color: "#111827",
  },

  legendGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
  },

  legendItem: {
    background: "#f3f4f6",
    padding: "16px",
    borderRadius: "14px",
    display: "flex",
    gap: "14px",
    alignItems: "center",
  },

  legendSymbol: {
    fontSize: "24px",
    color: "#e60000",
    minWidth: "55px",
  },

  legendMeaning: {
    fontWeight: "700",
    color: "#111827",
  },

  legendUnit: {
    color: "#374151",
    marginTop: "4px",
  },
};