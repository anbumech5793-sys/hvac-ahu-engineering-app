import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalExportDashboard() {
  const { projectData, designResult } = useProject();

  const exportJSON = () => {
    const exportData = {
      projectData,
      designResult,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });

    downloadFile(blob, "ahu-complete-project-data.json");
  };

  const exportCSV = () => {
    const rows = [
      ["Field", "Value", "Unit"],

      ["Project Name", projectData.projectName || "-", ""],
      ["Client Name", projectData.clientName || "-", ""],
      ["Location", projectData.location || "-", ""],
      ["Room Name", projectData.roomName || "-", ""],

      ["Room Length", projectData.roomLength, "m"],
      ["Room Width", projectData.roomWidth, "m"],
      ["Room Height", projectData.roomHeight, "m"],
      ["Floor Area", designResult.floorArea, "m²"],
      ["Room Volume", designResult.volume, "m³"],
      ["Wall Area", designResult.wallArea, "m²"],
      ["Roof Area", designResult.roofArea, "m²"],

      ["Indoor DBT", designResult.indoorDBT, "°C"],
      ["Outdoor DBT", designResult.outdoorDBT, "°C"],
      ["Indoor RH", designResult.indoorRH, "%"],
      ["Outdoor RH", designResult.outdoorRH, "%"],
      ["Indoor Humidity Ratio", designResult.indoorHumidityRatio, "g/kg"],
      ["Outdoor Humidity Ratio", designResult.outdoorHumidityRatio, "g/kg"],
      ["Indoor Enthalpy", designResult.indoorEnthalpy, "kJ/kg"],
      ["Outdoor Enthalpy", designResult.outdoorEnthalpy, "kJ/kg"],
      ["Indoor Dew Point", designResult.indoorDewPoint, "°C"],
      ["Outdoor Dew Point", designResult.outdoorDewPoint, "°C"],

      ["People Sensible Load", designResult.peopleSensible, "W"],
      ["People Latent Load", designResult.peopleLatent, "W"],
      ["Lighting Load", designResult.lightingLoad, "W"],
      ["Equipment Load", designResult.equipmentLoad, "W"],
      ["Wall Load", designResult.wallLoad, "W"],
      ["Roof Load", designResult.roofLoad, "W"],
      ["Glass Transmission Load", designResult.glassTransmissionLoad, "W"],
      ["Solar Load", designResult.solarLoad, "W"],
      ["Fresh Air", designResult.freshAirCFM, "CFM"],
      ["Fresh Air Sensible Load", designResult.freshAirSensible, "W"],
      ["Fresh Air Latent Load", designResult.freshAirLatent, "W"],

      ["Total Sensible Load", designResult.totalSensible, "W"],
      ["Total Latent Load", designResult.totalLatent, "W"],
      ["Total Heat Load", designResult.totalWatts, "W"],
      ["Total Cooling Load", designResult.totalKW, "kW"],
      ["Total Cooling Load", designResult.totalTR, "TR"],
      ["Design Cooling Load", designResult.designTR, "TR"],
      ["Required Air Flow", designResult.requiredCFM, "CFM"],
      ["SHR", designResult.SHR, "-"],
      ["ACH", designResult.roomACH, "1/hr"],

      ["Coil Capacity", designResult.coilTR, "TR"],
      ["Coil Capacity", designResult.coilKW, "kW"],
      ["Chilled Water Flow", designResult.chilledWaterFlowLPM, "LPM"],

      ["AHU Length", designResult.ahuLength, "mm"],
      ["AHU Width", designResult.ahuWidth, "mm"],
      ["AHU Height", designResult.ahuHeight, "mm"],
      ["Blower Air Flow", designResult.blowerCFM, "CFM"],
      ["Filter Air Flow", designResult.filterCFM, "CFM"],
      ["Duct Air Flow", designResult.ductCFM, "CFM"],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    downloadFile(blob, "ahu-complete-engineering-export.csv");
  };

  const printPDF = () => {
    window.print();
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Export Dashboard</h1>

      <p style={styles.subHeading}>
        Export complete HVAC AHU project data including heat load,
        psychrometric values, SHR, ACH, coil data, chilled water flow,
        AHU size, CFM and TR.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Project" value={projectData.projectName || "-"} />
        <SummaryBox label="Design Load" value={`${designResult.designTR} TR`} />
        <SummaryBox label="Air Flow" value={`${designResult.requiredCFM} CFM`} />
        <SummaryBox
          label="AHU Size"
          value={`${designResult.ahuLength} × ${designResult.ahuWidth} × ${designResult.ahuHeight} mm`}
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Export Options</h2>

        <div style={styles.buttonGrid}>
          <button style={styles.button} onClick={exportJSON}>
            Export Complete JSON
          </button>

          <button style={styles.button} onClick={exportCSV}>
            Export Complete CSV
          </button>

          <button style={styles.button} onClick={printPDF}>
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div style={styles.reportPreview}>
        <h2 style={styles.reportTitle}>Complete Export Preview</h2>

        <table style={styles.table}>
          <tbody>
            <TableRow label="Project Name" value={projectData.projectName || "-"} />
            <TableRow label="Client Name" value={projectData.clientName || "-"} />
            <TableRow label="Room Size" value={`${projectData.roomLength} × ${projectData.roomWidth} × ${projectData.roomHeight} m`} />
            <TableRow label="Room Volume" value={`${designResult.volume} m³`} />
            <TableRow label="Indoor Humidity Ratio" value={`${designResult.indoorHumidityRatio} g/kg`} />
            <TableRow label="Indoor Enthalpy" value={`${designResult.indoorEnthalpy} kJ/kg`} />
            <TableRow label="SHR" value={designResult.SHR} />
            <TableRow label="ACH" value={`${designResult.roomACH} 1/hr`} />
            <TableRow label="Fresh Air" value={`${designResult.freshAirCFM} CFM`} />
            <TableRow label="Total Heat Load" value={`${designResult.totalWatts} W`} />
            <TableRow label="Design Cooling Load" value={`${designResult.designTR} TR`} />
            <TableRow label="Required Air Flow" value={`${designResult.requiredCFM} CFM`} />
            <TableRow label="Coil Capacity" value={`${designResult.coilTR} TR / ${designResult.coilKW} kW`} />
            <TableRow label="Chilled Water Flow" value={`${designResult.chilledWaterFlowLPM} LPM`} />
            <TableRow label="AHU Size" value={`${designResult.ahuLength} × ${designResult.ahuWidth} × ${designResult.ahuHeight} mm`} />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function SummaryBox({ label, value }) {
  return (
    <div style={styles.summaryBox}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function TableRow({ label, value }) {
  return (
    <tr>
      <td style={styles.tdLabel}>{label}</td>
      <td style={styles.td}>{value}</td>
    </tr>
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
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  buttonGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "18px",
  },

  button: {
    background: "#e60000",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "14px",
    padding: "16px 22px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },

  reportPreview: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  reportTitle: {
    fontSize: "26px",
    color: "#111827",
    marginBottom: "18px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  tdLabel: {
    width: "35%",
    fontWeight: "800",
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
    background: "#f3f4f6",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
  },
};