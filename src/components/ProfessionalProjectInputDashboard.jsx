import React, { useState } from "react";
import { useProject } from "../context/ProjectContext";
import { supabase } from "../authEngine";

const wallOptions = [
  { label: "Brick Wall - Standard", value: 1.8 },
  { label: "Insulated Brick Wall", value: 0.6 },
  { label: "PUF Sandwich Panel", value: 0.3 },
  { label: "RCC Wall", value: 2.4 },
];

const roofOptions = [
  { label: "RCC Roof - Standard", value: 1.5 },
  { label: "Insulated Roof", value: 0.5 },
  { label: "PUF Roof Panel", value: 0.25 },
  { label: "Metal Sheet Roof", value: 5.0 },
];

const glassOptions = [
  { label: "Single Glass", value: 5.7 },
  { label: "Double Glass", value: 2.8 },
  { label: "Low-E Double Glass", value: 1.8 },
  { label: "No Glass", value: 0 },
];

export default function ProfessionalProjectInputDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    updateProjectData({ [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e) => {
    updateProjectData({ [e.target.name]: Number(e.target.value) });
  };

  async function saveProject() {
    setMessage("Saving project...");

    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData?.user) {
      setMessage("Please login first.");
      return;
    }

    if (!projectData.projectName || projectData.projectName.trim() === "") {
      setMessage("Please enter Project Name before saving.");
      return;
    }

    const payload = {
      user_id: userData.user.id,
      project_name: projectData.projectName,
      client_name: projectData.clientName || "",
      location: projectData.location || "",
      application: projectData.roomName || "HVAC AHU",
      project_data: {
        projectData,
        designResult,
      },
    };

    const { error } = await supabase.from("projects").insert(payload);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Project saved successfully.");
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Project Input Dashboard</h1>

      <p style={styles.subHeading}>
        Enter all project inputs once. Heat Load, CFM, AHU size, coil, blower,
        duct, BOM and GA drawing update automatically.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <button style={styles.saveButton} onClick={saveProject}>
        Save Project
      </button>

      <div style={styles.summaryCard}>
        <SummaryBox label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
        <SummaryBox label="Design Cooling Load" value={designResult.designTR} unit="TR" />
        <SummaryBox label="Room Volume" value={designResult.volume} unit="m³" />
        <SummaryBox label="AHU Size" value={`${designResult.ahuLength} × ${designResult.ahuWidth} × ${designResult.ahuHeight}`} unit="mm" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Project Information</h2>

        <div style={styles.grid}>
          <InputField label="Project Name" name="projectName" value={projectData.projectName} onChange={handleChange} />
          <InputField label="Client Name" name="clientName" value={projectData.clientName} onChange={handleChange} />
          <InputField label="Location" name="location" value={projectData.location} onChange={handleChange} />
          <InputField label="Room Name" name="roomName" value={projectData.roomName} onChange={handleChange} />
        </div>

        <h2 style={styles.sectionTitle}>Room Dimensions</h2>

        <div style={styles.grid}>
          <InputField label="Room Length" name="roomLength" unit="m" value={projectData.roomLength} onChange={handleChange} />
          <InputField label="Room Width" name="roomWidth" unit="m" value={projectData.roomWidth} onChange={handleChange} />
          <InputField label="Room Height" name="roomHeight" unit="m" value={projectData.roomHeight} onChange={handleChange} />
        </div>

        <h2 style={styles.sectionTitle}>Internal Loads</h2>

        <div style={styles.grid}>
          <InputField label="People Count" name="peopleCount" unit="Nos" value={projectData.peopleCount} onChange={handleChange} />
          <InputField label="Lighting Load" name="lightingLoad" unit="W" value={projectData.lightingLoad} onChange={handleChange} />
          <InputField label="Equipment Load" name="equipmentLoad" unit="W" value={projectData.equipmentLoad} onChange={handleChange} />
        </div>

        <h2 style={styles.sectionTitle}>Air & Weather Conditions</h2>

        <div style={styles.grid}>
          <InputField label="Indoor Temperature" name="indoorTemp" unit="°C" value={projectData.indoorTemp} onChange={handleChange} />
          <InputField label="Outdoor Temperature" name="outdoorTemp" unit="°C" value={projectData.outdoorTemp} onChange={handleChange} />
          <InputField label="Relative Humidity" name="relativeHumidity" unit="%" value={projectData.relativeHumidity} onChange={handleChange} />
        </div>

        <h2 style={styles.sectionTitle}>Construction Selection</h2>

        <div style={styles.grid}>
          <SelectField label="Wall Type" name="wallU" value={projectData.wallU} options={wallOptions} onChange={handleSelectChange} />
          <SelectField label="Roof Type" name="roofU" value={projectData.roofU} options={roofOptions} onChange={handleSelectChange} />
          <SelectField label="Glass Type" name="glassU" value={projectData.glassU} options={glassOptions} onChange={handleSelectChange} />
          <InputField label="Glass Area" name="glassArea" unit="m²" value={projectData.glassArea} onChange={handleChange} />
          <InputField label="Solar Factor" name="solarFactor" unit="W/m²" value={projectData.solarFactor} onChange={handleChange} />
        </div>

        <div style={styles.infoBox}>
          <strong>Selected Construction Values:</strong>
          <br />
          Wall U = {projectData.wallU} W/m²K | Roof U = {projectData.roofU} W/m²K | Glass U = {projectData.glassU} W/m²K
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Design Output</h2>

        <div style={styles.resultGrid}>
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
          <ResultBox label="AHU Length" value={designResult.ahuLength} unit="mm" />
          <ResultBox label="AHU Width" value={designResult.ahuWidth} unit="mm" />
          <ResultBox label="AHU Height" value={designResult.ahuHeight} unit="mm" />
        </div>
      </div>
    </div>
  );
}

function InputField({ label, name, unit, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label} {unit ? `(${unit})` : ""}</label>
      <input name={name} value={value ?? ""} onChange={onChange} style={styles.input} />
    </div>
  );
}

function SelectField({ label, name, value, options, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <select name={name} value={value ?? ""} onChange={onChange} style={styles.input}>
        {options.map((item) => (
          <option key={item.label} value={item.value}>
            {item.label} - {item.value} W/m²K
          </option>
        ))}
      </select>
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

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "40px", fontWeight: "800", color: "#111827", marginBottom: "10px" },
  subHeading: { fontSize: "18px", color: "#374151", marginBottom: "22px" },
  message: { background: "#fef3c7", padding: "14px", borderRadius: "12px", marginBottom: "18px", fontWeight: "800" },
  saveButton: { background: "#16a34a", color: "white", border: "none", borderRadius: "14px", padding: "14px 24px", fontSize: "16px", fontWeight: "900", cursor: "pointer", marginBottom: "24px" },
  summaryCard: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  summaryBox: { background: "#111827", color: "white", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px" },
  sectionTitle: { fontSize: "23px", color: "#111827", marginTop: "10px", marginBottom: "18px", borderBottom: "2px solid #e60000", paddingBottom: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "18px", marginBottom: "24px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "700", marginBottom: "8px", color: "#111827" },
  input: { padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", background: "white" },
  infoBox: { background: "#f3f4f6", borderRadius: "14px", padding: "16px", marginTop: "10px", fontSize: "16px" },
  resultCard: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
  resultHeading: { fontSize: "28px", color: "#111827", marginBottom: "20px" },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  resultBox: { background: "#f3f4f6", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" },
};