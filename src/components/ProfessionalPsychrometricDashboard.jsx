import React from "react";
import { useProject } from "../context/ProjectContext";
import { runProfessionalPsychrometricEngine } from "../engines/ProfessionalPsychrometricEngine";
import ProfessionalPsychrometricChart from "./ProfessionalPsychrometricChart";

export default function ProfessionalPsychrometricDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const psychroResult = runProfessionalPsychrometricEngine({
    dryBulbTemp: projectData.indoorTemp || 24,
    relativeHumidity: projectData.relativeHumidity || 55,
    atmosphericPressure: projectData.atmosphericPressure || 101.325,
  });

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Psychrometric Dashboard</h1>

      <p style={styles.subHeading}>
        This module is connected to Project Input. Change indoor temperature or
        RH and the chart updates automatically.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="DBT" value={projectData.indoorTemp} unit="°C" />
        <SummaryBox label="RH" value={projectData.relativeHumidity} unit="%" />
        <SummaryBox label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
        <SummaryBox label="Design Load" value={designResult.designTR} unit="TR" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Air Condition Input</h2>

        <div style={styles.grid}>
          <InputField
            label="Dry Bulb Temperature"
            name="indoorTemp"
            unit="°C"
            value={projectData.indoorTemp}
            onChange={handleChange}
          />

          <InputField
            label="Relative Humidity"
            name="relativeHumidity"
            unit="%"
            value={projectData.relativeHumidity}
            onChange={handleChange}
          />

          <InputField
            label="Atmospheric Pressure"
            name="atmosphericPressure"
            unit="kPa"
            value={projectData.atmosphericPressure || 101.325}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Psychrometric Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Dry Bulb Temperature" value={psychroResult.dryBulbTemp} unit="°C" />
          <ResultBox label="Wet Bulb Temperature" value={psychroResult.wetBulbTemp} unit="°C" />
          <ResultBox label="Relative Humidity" value={psychroResult.relativeHumidity} unit="%" />
          <ResultBox label="Humidity Ratio" value={psychroResult.humidityRatio} unit="g/kg" />
          <ResultBox label="Enthalpy" value={psychroResult.enthalpy} unit="kJ/kg dry air" />
          <ResultBox label="Dew Point" value={psychroResult.dewPoint} unit="°C" />
          <ResultBox label="Specific Volume" value={psychroResult.specificVolume} unit="m³/kg" />
          <ResultBox label="Air Density" value={psychroResult.airDensity} unit="kg/m³" />
          <ResultBox label="Apparatus Dew Point" value={psychroResult.apparatusDewPoint} unit="°C" />
          <ResultBox label="Sensible Heat Factor" value={psychroResult.sensibleHeatFactor} unit="-" />
          <ResultBox label="Room SHF" value={psychroResult.roomSHF} unit="-" />
          <ResultBox label="Grand SHF" value={psychroResult.grandSHF} unit="-" />
        </div>
      </div>

      <ProfessionalPsychrometricChart
        dryBulbTemp={Number(projectData.indoorTemp || 24)}
        relativeHumidity={Number(projectData.relativeHumidity || 55)}
        humidityRatio={Number(psychroResult.humidityRatio || 0)}
      />

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Engineering Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="DBT" meaning="Dry Bulb Temperature" unit="°C" />
          <LegendItem symbol="WBT" meaning="Wet Bulb Temperature" unit="°C" />
          <LegendItem symbol="RH" meaning="Relative Humidity" unit="%" />
          <LegendItem symbol="W" meaning="Humidity Ratio" unit="g/kg dry air" />
          <LegendItem symbol="h" meaning="Enthalpy" unit="kJ/kg dry air" />
          <LegendItem symbol="DP" meaning="Dew Point" unit="°C" />
          <LegendItem symbol="ADP" meaning="Apparatus Dew Point" unit="°C" />
          <LegendItem symbol="SHF" meaning="Sensible Heat Factor" unit="-" />
          <LegendItem symbol="CFM" meaning="Cubic Feet per Minute" unit="CFM" />
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
    marginTop: "30px",
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