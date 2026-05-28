import React from "react";
import { useProject } from "../context/ProjectContext";
import { runCleanroomHVACEngine } from "../engines/CleanroomHVACEngine";

export default function ProfessionalCleanroomDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const cleanroomResult = runCleanroomHVACEngine(projectData, designResult);

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Cleanroom HVAC Dashboard</h1>

      <p style={styles.subHeading}>
        Cleanroom airflow is automatically calculated from room volume, ISO class,
        ACPH, heat load CFM, HEPA airflow and pressure cascade.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Cleanroom Class" value={cleanroomResult.cleanroomClass} />
        <SummaryBox label="Final Airflow" value={`${cleanroomResult.finalRequiredCFM} CFM`} />
        <SummaryBox label="Recommended ACPH" value={`${cleanroomResult.recommendedACPH}`} />
        <SummaryBox label="HEPA Quantity" value={`${cleanroomResult.hepaFilterQty} Nos`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cleanroom Input Selection</h2>

        <div style={styles.grid}>
          <SelectField
            label="Cleanroom Class"
            name="cleanroomClass"
            value={projectData.cleanroomClass || "ISO 8"}
            options={["ISO 5", "ISO 6", "ISO 7", "ISO 8", "CNC"]}
            onChange={handleChange}
          />

          <SelectField
            label="Room Type"
            name="cleanroomRoomType"
            value={projectData.cleanroomRoomType || "General Pharma Room"}
            options={[
              "General Pharma Room",
              "Sterile Filling Room",
              "Packing Room",
              "Material Air Lock",
              "Personnel Air Lock",
              "Granulation Room",
              "Compression Room",
            ]}
            onChange={handleChange}
          />

          <InputField
            label="Fresh Air Percentage"
            name="cleanroomFreshAirPercent"
            unit="%"
            value={projectData.cleanroomFreshAirPercent || 10}
            onChange={handleChange}
          />

          <InputField
            label="Exhaust Percentage"
            name="cleanroomExhaustPercent"
            unit="%"
            value={projectData.cleanroomExhaustPercent || 5}
            onChange={handleChange}
          />

          <InputField
            label="HEPA Filter Capacity"
            name="hepaFilterCFM"
            unit="CFM/filter"
            value={projectData.hepaFilterCFM || 500}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Cleanroom HVAC Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Floor Area" value={cleanroomResult.floorArea} unit="m²" />
          <ResultBox label="Room Volume" value={cleanroomResult.roomVolume} unit="m³" />
          <ResultBox label="Recommended ACPH" value={cleanroomResult.recommendedACPH} unit="1/hr" />
          <ResultBox label="Cleanroom Airflow" value={cleanroomResult.cleanroomAirflowCFM} unit="CFM" />
          <ResultBox label="Cleanroom Airflow" value={cleanroomResult.cleanroomAirflowCMH} unit="CMH" />
          <ResultBox label="Heat Load CFM" value={cleanroomResult.heatLoadCFM} unit="CFM" />
          <ResultBox label="Final Required Airflow" value={cleanroomResult.finalRequiredCFM} unit="CFM" />
          <ResultBox label="Final Required Airflow" value={cleanroomResult.finalRequiredCMH} unit="CMH" />
          <ResultBox label="Fresh Air" value={cleanroomResult.freshAirCFM} unit="CFM" />
          <ResultBox label="Recirculation Air" value={cleanroomResult.recirculationCFM} unit="CFM" />
          <ResultBox label="Exhaust Air" value={cleanroomResult.exhaustCFM} unit="CFM" />
          <ResultBox label="Return Air" value={cleanroomResult.returnCFM} unit="CFM" />
          <ResultBox label="Supply Air" value={cleanroomResult.supplyCFM} unit="CFM" />
          <ResultBox label="HEPA Filter Qty" value={cleanroomResult.hepaFilterQty} unit="Nos" />
          <ResultBox label="Target Room Pressure" value={cleanroomResult.targetRoomPressure} unit="" />
          <ResultBox label="Recovery Time" value={cleanroomResult.recoveryTimeMinutes} unit="min" />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cleanroom Engineering Status</h2>

        <div style={styles.statusBox}>
          <strong>Airflow Basis:</strong> {cleanroomResult.airflowBasis}
        </div>

        <div style={styles.statusBox}>
          <strong>ACPH Status:</strong> {cleanroomResult.airChangeStatus}
        </div>

        <div style={styles.statusBox}>
          <strong>Pressure Cascade:</strong> {cleanroomResult.pressureCascade}
        </div>
      </div>

      <div style={styles.legendCard}>
        <h2 style={styles.legendHeading}>Cleanroom Symbols & Units</h2>

        <div style={styles.legendGrid}>
          <LegendItem symbol="ACPH" meaning="Air Changes Per Hour" unit="1/hr" />
          <LegendItem symbol="ISO" meaning="Cleanroom Classification" unit="Class" />
          <LegendItem symbol="CFM" meaning="Cubic Feet Per Minute" unit="CFM" />
          <LegendItem symbol="CMH" meaning="Cubic Meter Per Hour" unit="m³/hr" />
          <LegendItem symbol="HEPA" meaning="High Efficiency Particulate Air Filter" unit="Nos" />
          <LegendItem symbol="Pa" meaning="Room Differential Pressure" unit="Pa" />
          <LegendItem symbol="FA" meaning="Fresh Air" unit="CFM" />
          <LegendItem symbol="RA" meaning="Return Air" unit="CFM" />
          <LegendItem symbol="EA" meaning="Exhaust Air" unit="CFM" />
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

function SelectField({ label, name, value, options, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>

      <select name={name} value={value} onChange={onChange} style={styles.input}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
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

  statusBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "18px",
    marginBottom: "14px",
    fontSize: "16px",
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
    minWidth: "65px",
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