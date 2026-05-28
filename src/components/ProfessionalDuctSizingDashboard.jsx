import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalDuctSizingDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);
  const ductVelocity = Number(projectData.ductVelocity || 7);
  const aspectRatio = Number(projectData.ductAspectRatio || 2);
  const ductLength = Number(projectData.ductLength || 20);
  const frictionRate = Number(projectData.frictionRate || 1.2);
  const fittingLossFactor = Number(projectData.fittingLossFactor || 0.3);

  const airFlowM3s = airFlowCFM * 0.000471947;
  const airFlowCMH = airFlowCFM * 1.699;
  const ductArea = airFlowM3s / ductVelocity;

  const ductHeightM = Math.sqrt(ductArea / aspectRatio);
  const ductWidthM = ductHeightM * aspectRatio;

  const ductWidthMM = ductWidthM * 1000;
  const ductHeightMM = ductHeightM * 1000;

  const hydraulicDiameterM =
    (2 * ductWidthM * ductHeightM) / (ductWidthM + ductHeightM);

  const equivalentDiameterMM =
    (1.3 * Math.pow(ductWidthMM * ductHeightMM, 0.625)) /
    Math.pow(ductWidthMM + ductHeightMM, 0.25);

  const velocityPressure = 0.6 * Math.pow(ductVelocity, 2);
  const frictionPressureDrop = frictionRate * ductLength;
  const fittingPressureDrop = frictionPressureDrop * fittingLossFactor;
  const totalPressureDrop = frictionPressureDrop + fittingPressureDrop;

  const roundDuctDiameterMM = Math.sqrt((4 * ductArea) / Math.PI) * 1000;

  const velocityStatus =
    ductVelocity < 4
      ? "Low Velocity - Duct size may become large"
      : ductVelocity > 10
      ? "High Velocity - Noise and pressure drop may increase"
      : "Acceptable HVAC Velocity";

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Duct Sizing Dashboard</h1>

      <p style={styles.subHeading}>
        Duct sizing is automatically calculated from master AHU airflow.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Auto Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
        <SummaryBox label="Air Flow" value={airFlowCMH.toFixed(2)} unit="CMH" />
        <SummaryBox label="Recommended Width" value={ductWidthMM.toFixed(0)} unit="mm" />
        <SummaryBox label="Recommended Height" value={ductHeightMM.toFixed(0)} unit="mm" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Duct Design Inputs</h2>

        <div style={styles.grid}>
          <InputField label="Duct Velocity" name="ductVelocity" unit="m/s" value={projectData.ductVelocity || 7} onChange={handleChange} />
          <InputField label="Aspect Ratio" name="ductAspectRatio" unit="W/H" value={projectData.ductAspectRatio || 2} onChange={handleChange} />
          <InputField label="Duct Length" name="ductLength" unit="m" value={projectData.ductLength || 20} onChange={handleChange} />
          <InputField label="Friction Rate" name="frictionRate" unit="Pa/m" value={projectData.frictionRate || 1.2} onChange={handleChange} />
          <InputField label="Fitting Loss Factor" name="fittingLossFactor" unit="x" value={projectData.fittingLossFactor || 0.3} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Duct Sizing Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
          <ResultBox label="Air Flow" value={airFlowM3s.toFixed(3)} unit="m³/s" />
          <ResultBox label="Air Flow" value={airFlowCMH.toFixed(2)} unit="CMH" />
          <ResultBox label="Duct Velocity" value={ductVelocity.toFixed(2)} unit="m/s" />
          <ResultBox label="Required Duct Area" value={ductArea.toFixed(3)} unit="m²" />
          <ResultBox label="Rectangular Duct Width" value={ductWidthMM.toFixed(0)} unit="mm" />
          <ResultBox label="Rectangular Duct Height" value={ductHeightMM.toFixed(0)} unit="mm" />
          <ResultBox label="Round Duct Diameter" value={roundDuctDiameterMM.toFixed(0)} unit="mm" />
          <ResultBox label="Hydraulic Diameter" value={(hydraulicDiameterM * 1000).toFixed(0)} unit="mm" />
          <ResultBox label="Equivalent Diameter" value={equivalentDiameterMM.toFixed(0)} unit="mm" />
          <ResultBox label="Velocity Pressure" value={velocityPressure.toFixed(2)} unit="Pa" />
          <ResultBox label="Friction Pressure Drop" value={frictionPressureDrop.toFixed(2)} unit="Pa" />
          <ResultBox label="Fitting Pressure Drop" value={fittingPressureDrop.toFixed(2)} unit="Pa" />
          <ResultBox label="Total Pressure Drop" value={totalPressureDrop.toFixed(2)} unit="Pa" />
          <ResultBox label="Velocity Status" value={velocityStatus} unit="" />
        </div>
      </div>

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Engineering Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="CFM" meaning="Cubic Feet per Minute" unit="CFM" />
          <LegendItem symbol="CMH" meaning="Cubic Meter per Hour" unit="m³/hr" />
          <LegendItem symbol="V" meaning="Air Velocity" unit="m/s" />
          <LegendItem symbol="A" meaning="Duct Area" unit="m²" />
          <LegendItem symbol="De" meaning="Equivalent Diameter" unit="mm" />
          <LegendItem symbol="Dh" meaning="Hydraulic Diameter" unit="mm" />
          <LegendItem symbol="Pv" meaning="Velocity Pressure" unit="Pa" />
          <LegendItem symbol="ΔP" meaning="Pressure Drop" unit="Pa" />
          <LegendItem symbol="W/H" meaning="Width to Height Ratio" unit="-" />
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
    marginBottom: "24px",
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