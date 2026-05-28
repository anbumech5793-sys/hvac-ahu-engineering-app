import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalFilterSelectionDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);
  const filterFaceVelocity = Number(projectData.filterFaceVelocity || 2.5);
  const filterWidth = Number(projectData.filterWidth || 610);
  const filterHeight = Number(projectData.filterHeight || 610);
  const initialPD = Number(projectData.filterInitialPD || 120);
  const finalPD = Number(projectData.filterFinalPD || 250);
  const filterEfficiency = Number(projectData.filterEfficiency || 99.97);

  const airFlowM3s = airFlowCFM * 0.000471947;
  const requiredArea = airFlowM3s / filterFaceVelocity;

  const singleFilterArea = (filterWidth * filterHeight) / 1000000;
  const filterQty = Math.max(1, Math.ceil(requiredArea / singleFilterArea));
  const providedArea = filterQty * singleFilterArea;
  const actualFaceVelocity = airFlowM3s / providedArea;

  const recommendedFilterType =
    filterEfficiency >= 99.97
      ? "HEPA Filter"
      : filterEfficiency >= 85
      ? "Fine Filter"
      : "Pre Filter";

  const cleanroomSuitability =
    filterEfficiency >= 99.97
      ? "ISO / Pharma Cleanroom Suitable"
      : filterEfficiency >= 85
      ? "Comfort HVAC / Fine Filtration"
      : "Pre Filtration Only";

  const velocityStatus =
    actualFaceVelocity > 2.5
      ? "High Velocity - Increase filter quantity"
      : actualFaceVelocity < 1.2
      ? "Low Velocity - Acceptable but oversized"
      : "Acceptable";

  const pressureDropGrowth = finalPD - initialPD;

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Filter Selection Dashboard</h1>

      <p style={styles.subHeading}>
        Filter selection is automatically calculated from master AHU airflow.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Auto Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
        <SummaryBox label="Required Filter Area" value={requiredArea.toFixed(2)} unit="m²" />
        <SummaryBox label="Filter Quantity" value={filterQty} unit="Nos" />
        <SummaryBox label="Filter Type" value={recommendedFilterType} unit="" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Filter Design Inputs</h2>

        <div style={styles.grid}>
          <InputField label="Filter Face Velocity" name="filterFaceVelocity" unit="m/s" value={projectData.filterFaceVelocity || 2.5} onChange={handleChange} />
          <InputField label="Filter Width" name="filterWidth" unit="mm" value={projectData.filterWidth || 610} onChange={handleChange} />
          <InputField label="Filter Height" name="filterHeight" unit="mm" value={projectData.filterHeight || 610} onChange={handleChange} />
          <InputField label="Initial Pressure Drop" name="filterInitialPD" unit="Pa" value={projectData.filterInitialPD || 120} onChange={handleChange} />
          <InputField label="Final Pressure Drop" name="filterFinalPD" unit="Pa" value={projectData.filterFinalPD || 250} onChange={handleChange} />
          <InputField label="Filter Efficiency" name="filterEfficiency" unit="%" value={projectData.filterEfficiency || 99.97} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Filter Selection Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
          <ResultBox label="Air Flow" value={airFlowM3s.toFixed(3)} unit="m³/s" />
          <ResultBox label="Filter Face Velocity" value={filterFaceVelocity.toFixed(2)} unit="m/s" />
          <ResultBox label="Required Filter Area" value={requiredArea.toFixed(2)} unit="m²" />
          <ResultBox label="Single Filter Size" value={`${filterWidth} × ${filterHeight}`} unit="mm" />
          <ResultBox label="Single Filter Area" value={singleFilterArea.toFixed(3)} unit="m²" />
          <ResultBox label="Filter Quantity Required" value={filterQty} unit="Nos" />
          <ResultBox label="Provided Filter Area" value={providedArea.toFixed(2)} unit="m²" />
          <ResultBox label="Actual Face Velocity" value={actualFaceVelocity.toFixed(2)} unit="m/s" />
          <ResultBox label="Initial Pressure Drop" value={initialPD.toFixed(2)} unit="Pa" />
          <ResultBox label="Final Pressure Drop" value={finalPD.toFixed(2)} unit="Pa" />
          <ResultBox label="Pressure Drop Growth" value={pressureDropGrowth.toFixed(2)} unit="Pa" />
          <ResultBox label="Recommended Filter Type" value={recommendedFilterType} unit="" />
          <ResultBox label="Cleanroom Suitability" value={cleanroomSuitability} unit="" />
          <ResultBox label="Velocity Status" value={velocityStatus} unit="" />
        </div>
      </div>

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Engineering Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="CFM" meaning="Cubic Feet per Minute" unit="CFM" />
          <LegendItem symbol="HEPA" meaning="High Efficiency Particulate Air Filter" unit="%" />
          <LegendItem symbol="Pa" meaning="Pascal Pressure Drop" unit="Pa" />
          <LegendItem symbol="A" meaning="Filter Face Area" unit="m²" />
          <LegendItem symbol="V" meaning="Face Velocity" unit="m/s" />
          <LegendItem symbol="η" meaning="Filter Efficiency" unit="%" />
          <LegendItem symbol="PD" meaning="Pressure Drop" unit="Pa" />
          <LegendItem symbol="Nos" meaning="Number of Filters" unit="Nos" />
          <LegendItem symbol="ISO" meaning="Cleanroom Classification Reference" unit="Class" />
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