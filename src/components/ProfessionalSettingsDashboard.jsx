import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalSettingsDashboard() {
  const { projectData, updateProjectData } = useProject();

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  const resetDefaults = () => {
    updateProjectData({
      designStandard: "ASHRAE / ISHRAE Reference",
      unitSystem: "SI + HVAC Mixed Units",
      projectType: "Pharma AHU",
      applicationType: "Cleanroom HVAC",

      safetyFactor: 10,
      cfmPerTR: 400,
      freshAirPerPerson: 20,

      defaultFanEfficiency: 65,
      defaultMotorEfficiency: 90,
      defaultCoilFaceVelocity: 2.5,
      defaultDuctVelocity: 7,
      defaultFilterVelocity: 2.5,

      cleanroomClass: "ISO 8",
      cleanroomRoomType: "General Pharma Room",
      cleanroomFreshAirPercent: 10,
      cleanroomExhaustPercent: 5,
      cleanroomDefaultACPH: 25,
      hepaFilterCFM: 500,

      companyName: "APFEL GLOBUS ENGINEERING",
      reportPreparedBy: "",
      reportCheckedBy: "",
      drawingPrefix: "AHU-GA",
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Settings Dashboard</h1>

      <p style={styles.subHeading}>
        Configure project standards, calculation defaults, cleanroom settings,
        and report details from one place.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Project Type" value={projectData.projectType || "Pharma AHU"} />
        <SummaryBox label="Standard" value={projectData.designStandard || "ASHRAE / ISHRAE Reference"} />
        <SummaryBox label="Cleanroom Class" value={projectData.cleanroomClass || "ISO 8"} />
        <SummaryBox label="HEPA Capacity" value={`${projectData.hepaFilterCFM || 500} CFM`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Design Standard Settings</h2>

        <div style={styles.grid}>
          <SelectField
            label="Design Standard"
            name="designStandard"
            value={projectData.designStandard || "ASHRAE / ISHRAE Reference"}
            options={[
              "ASHRAE / ISHRAE Reference",
              "Pharma GMP Internal Standard",
              "Hospital HVAC Reference",
              "Industrial Comfort HVAC",
            ]}
            onChange={handleChange}
          />

          <SelectField
            label="Project Type"
            name="projectType"
            value={projectData.projectType || "Pharma AHU"}
            options={[
              "Pharma AHU",
              "Cleanroom AHU",
              "Hospital AHU",
              "Comfort HVAC AHU",
              "Industrial AHU",
            ]}
            onChange={handleChange}
          />

          <SelectField
            label="Application Type"
            name="applicationType"
            value={projectData.applicationType || "Cleanroom HVAC"}
            options={[
              "Cleanroom HVAC",
              "Process Area HVAC",
              "Office Comfort HVAC",
              "Laboratory HVAC",
              "Warehouse Ventilation",
            ]}
            onChange={handleChange}
          />

          <SelectField
            label="Unit System"
            name="unitSystem"
            value={projectData.unitSystem || "SI + HVAC Mixed Units"}
            options={["SI + HVAC Mixed Units", "SI Only", "IP Units"]}
            onChange={handleChange}
          />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Global HVAC Calculation Defaults</h2>

        <div style={styles.grid}>
          <InputField label="Safety Factor" name="safetyFactor" unit="%" value={projectData.safetyFactor || 10} onChange={handleChange} />
          <InputField label="CFM per TR" name="cfmPerTR" unit="CFM/TR" value={projectData.cfmPerTR || 400} onChange={handleChange} />
          <InputField label="Fresh Air Per Person" name="freshAirPerPerson" unit="CFM/person" value={projectData.freshAirPerPerson || 20} onChange={handleChange} />
          <InputField label="Fan Efficiency" name="defaultFanEfficiency" unit="%" value={projectData.defaultFanEfficiency || 65} onChange={handleChange} />
          <InputField label="Motor Efficiency" name="defaultMotorEfficiency" unit="%" value={projectData.defaultMotorEfficiency || 90} onChange={handleChange} />
          <InputField label="Coil Face Velocity" name="defaultCoilFaceVelocity" unit="m/s" value={projectData.defaultCoilFaceVelocity || 2.5} onChange={handleChange} />
          <InputField label="Duct Velocity" name="defaultDuctVelocity" unit="m/s" value={projectData.defaultDuctVelocity || 7} onChange={handleChange} />
          <InputField label="Filter Face Velocity" name="defaultFilterVelocity" unit="m/s" value={projectData.defaultFilterVelocity || 2.5} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cleanroom / Pharma HVAC Settings</h2>

        <p style={styles.note}>
          These settings are used for cleanroom airflow, HEPA selection, pressure
          cascade, validation, and final project report. They are kept here to
          avoid confusing users with a separate dashboard.
        </p>

        <div style={styles.grid}>
          <SelectField
            label="Cleanroom Class"
            name="cleanroomClass"
            value={projectData.cleanroomClass || "ISO 8"}
            options={["ISO 5", "ISO 6", "ISO 7", "ISO 8", "CNC"]}
            onChange={handleChange}
          />

          <SelectField
            label="Cleanroom Room Type"
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
            label="Default ACPH"
            name="cleanroomDefaultACPH"
            unit="1/hr"
            value={projectData.cleanroomDefaultACPH || 25}
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
            label="Exhaust Air Percentage"
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

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Report & Company Settings</h2>

        <div style={styles.grid}>
          <InputField label="Company Name" name="companyName" value={projectData.companyName || "APFEL GLOBUS ENGINEERING"} onChange={handleChange} />
          <InputField label="Report Prepared By" name="reportPreparedBy" value={projectData.reportPreparedBy || ""} onChange={handleChange} />
          <InputField label="Report Checked By" name="reportCheckedBy" value={projectData.reportCheckedBy || ""} onChange={handleChange} />
          <InputField label="Drawing Prefix" name="drawingPrefix" value={projectData.drawingPrefix || "AHU-GA"} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.actionCard}>
        <button style={styles.resetButton} onClick={resetDefaults}>
          Reset Professional Defaults
        </button>
      </div>
    </div>
  );
}

function InputField({ label, name, unit, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>
        {label} {unit ? `(${unit})` : ""}
      </label>

      <input
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

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "10px" },
  subHeading: { fontSize: "18px", color: "#374151", marginBottom: "22px" },

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

  note: {
    background: "#f3f4f6",
    borderRadius: "12px",
    padding: "14px",
    color: "#374151",
    marginBottom: "18px",
    lineHeight: "1.6",
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

  actionCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  resetButton: {
    background: "#e60000",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "14px",
    padding: "16px 24px",
    fontSize: "17px",
    fontWeight: "800",
    cursor: "pointer",
  },
};