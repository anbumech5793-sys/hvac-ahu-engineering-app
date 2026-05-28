import React, { useEffect, useState } from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalProjectDatabaseDashboard() {
  const { projectData, designResult } = useProject();
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const saveProject = () => {
    const savedProjects = JSON.parse(localStorage.getItem("ahuProjects")) || [];

    const newProject = {
      id: Date.now(),
      savedAt: new Date().toLocaleString(),

      projectName: projectData.projectName || "Untitled Project",
      clientName: projectData.clientName || "-",
      location: projectData.location || "-",
      roomName: projectData.roomName || "-",

      roomLength: projectData.roomLength,
      roomWidth: projectData.roomWidth,
      roomHeight: projectData.roomHeight,
      roomSize: `${projectData.roomLength} × ${projectData.roomWidth} × ${projectData.roomHeight} m`,

      peopleCount: projectData.peopleCount,
      lightingLoad: projectData.lightingLoad,
      equipmentLoad: projectData.equipmentLoad,

      indoorTemp: projectData.indoorTemp,
      outdoorTemp: projectData.outdoorTemp,
      relativeHumidity: projectData.relativeHumidity,

      floorArea: designResult.floorArea,
      roomVolume: designResult.volume,
      wallArea: designResult.wallArea,
      roofArea: designResult.roofArea,

      indoorHumidityRatio: designResult.indoorHumidityRatio,
      outdoorHumidityRatio: designResult.outdoorHumidityRatio,
      indoorEnthalpy: designResult.indoorEnthalpy,
      outdoorEnthalpy: designResult.outdoorEnthalpy,
      indoorDewPoint: designResult.indoorDewPoint,
      outdoorDewPoint: designResult.outdoorDewPoint,

      peopleSensible: designResult.peopleSensible,
      peopleLatent: designResult.peopleLatent,
      freshAirCFM: designResult.freshAirCFM,
      freshAirSensible: designResult.freshAirSensible,
      freshAirLatent: designResult.freshAirLatent,

      totalSensible: designResult.totalSensible,
      totalLatent: designResult.totalLatent,
      totalHeatLoad: designResult.totalWatts,
      totalKW: designResult.totalKW,
      totalTR: designResult.totalTR,
      designTR: designResult.designTR,
      requiredCFM: designResult.requiredCFM,
      SHR: designResult.SHR,
      ACH: designResult.roomACH,

      coilTR: designResult.coilTR,
      coilKW: designResult.coilKW,
      chilledWaterFlowLPM: designResult.chilledWaterFlowLPM,

      ahuLength: designResult.ahuLength,
      ahuWidth: designResult.ahuWidth,
      ahuHeight: designResult.ahuHeight,
      ahuSize: `${designResult.ahuLength} × ${designResult.ahuWidth} × ${designResult.ahuHeight} mm`,
    };

    savedProjects.unshift(newProject);
    localStorage.setItem("ahuProjects", JSON.stringify(savedProjects));
    setProjects(savedProjects);
  };

  const loadProjects = () => {
    const savedProjects = JSON.parse(localStorage.getItem("ahuProjects")) || [];
    setProjects(savedProjects);
  };

  const deleteProject = (id) => {
    const updated = projects.filter((item) => item.id !== id);
    localStorage.setItem("ahuProjects", JSON.stringify(updated));
    setProjects(updated);
  };

  const clearAllProjects = () => {
    localStorage.removeItem("ahuProjects");
    setProjects([]);
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Automatic Project Database Dashboard</h1>

      <p style={styles.subHeading}>
        Save complete HVAC AHU project history including heat load, psychrometric values,
        SHR, ACH, coil data, chilled water flow, CFM, TR and AHU size.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Saved Projects" value={projects.length} />
        <SummaryBox label="Current Design TR" value={`${designResult.designTR || 0} TR`} />
        <SummaryBox label="Current Air Flow" value={`${designResult.requiredCFM || 0} CFM`} />
        <SummaryBox label="Current ACH" value={`${designResult.roomACH || 0} ACH`} />
      </div>

      <div style={styles.actionCard}>
        <button style={styles.saveButton} onClick={saveProject}>
          Save Current Project
        </button>

        <button style={styles.clearButton} onClick={clearAllProjects}>
          Clear Database
        </button>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Automatic Project History</h2>

        {projects.length === 0 ? (
          <div style={styles.emptyBox}>No saved projects available.</div>
        ) : (
          <div style={styles.projectGrid}>
            {projects.map((project) => (
              <div key={project.id} style={styles.projectCard}>
                <div style={styles.projectHeader}>
                  <h3 style={styles.projectTitle}>{project.projectName}</h3>

                  <button
                    style={styles.deleteButton}
                    onClick={() => deleteProject(project.id)}
                  >
                    Delete
                  </button>
                </div>

                <ProjectRow label="Client" value={project.clientName} />
                <ProjectRow label="Location" value={project.location} />
                <ProjectRow label="Room" value={project.roomName} />
                <ProjectRow label="Room Size" value={project.roomSize} />
                <ProjectRow label="Room Volume" value={`${project.roomVolume} m³`} />
                <ProjectRow label="Floor Area" value={`${project.floorArea} m²`} />

                <ProjectRow label="People" value={`${project.peopleCount} Nos`} />
                <ProjectRow label="Lighting" value={`${project.lightingLoad} W`} />
                <ProjectRow label="Equipment" value={`${project.equipmentLoad} W`} />

                <ProjectRow label="Indoor Temp" value={`${project.indoorTemp} °C`} />
                <ProjectRow label="Outdoor Temp" value={`${project.outdoorTemp} °C`} />
                <ProjectRow label="RH" value={`${project.relativeHumidity} %`} />

                <ProjectRow
                  label="Indoor Humidity Ratio"
                  value={`${project.indoorHumidityRatio} g/kg`}
                />
                <ProjectRow
                  label="Indoor Enthalpy"
                  value={`${project.indoorEnthalpy} kJ/kg`}
                />
                <ProjectRow
                  label="Indoor Dew Point"
                  value={`${project.indoorDewPoint} °C`}
                />

                <ProjectRow label="Fresh Air" value={`${project.freshAirCFM} CFM`} />
                <ProjectRow label="Total Sensible" value={`${project.totalSensible} W`} />
                <ProjectRow label="Total Latent" value={`${project.totalLatent} W`} />
                <ProjectRow label="Total Heat Load" value={`${project.totalHeatLoad} W`} />
                <ProjectRow label="Cooling Load" value={`${project.totalTR} TR`} />
                <ProjectRow label="Design Load" value={`${project.designTR} TR`} />
                <ProjectRow label="Required Air Flow" value={`${project.requiredCFM} CFM`} />
                <ProjectRow label="SHR" value={project.SHR} />
                <ProjectRow label="ACH" value={`${project.ACH} ACH`} />

                <ProjectRow label="Coil Capacity" value={`${project.coilTR} TR`} />
                <ProjectRow label="Coil kW" value={`${project.coilKW} kW`} />
                <ProjectRow
                  label="Chilled Water Flow"
                  value={`${project.chilledWaterFlowLPM} LPM`}
                />

                <ProjectRow label="AHU Size" value={project.ahuSize} />
                <ProjectRow label="Saved At" value={project.savedAt} />
              </div>
            ))}
          </div>
        )}
      </div>
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

function ProjectRow({ label, value }) {
  return (
    <div style={styles.row}>
      <strong>{label}</strong>
      <span>{value ?? "-"}</span>
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

  actionCard: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
  },

  saveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "16px 22px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  clearButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "16px 22px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  card: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  emptyBox: {
    padding: "40px",
    textAlign: "center",
    background: "#f3f4f6",
    borderRadius: "14px",
    fontSize: "18px",
  },

  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "22px",
  },

  projectCard: {
    background: "#f9fafb",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid #d1d5db",
  },

  projectHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
  },

  projectTitle: {
    fontSize: "22px",
    fontWeight: "800",
    color: "#111827",
  },

  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: "700",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    borderBottom: "1px solid #e5e7eb",
    padding: "8px 0",
    fontSize: "14px",
  },
};