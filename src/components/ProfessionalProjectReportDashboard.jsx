import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import { useProject } from "../context/ProjectContext";
import ProfessionalPsychrometricChart from "./ProfessionalPsychrometricChart";

export default function ProfessionalProjectReportDashboard() {
  const { projectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);
  const designTR = Number(designResult.designTR || 0);

  const heatLoadPie = [
    { name: "Sensible Load", value: Number(designResult.totalSensible || 0) },
    { name: "Latent Load", value: Number(designResult.totalLatent || 0) },
  ];

  const loadBar = [
    { name: "Total Heat W", value: Number(designResult.totalWatts || 0) },
    { name: "Design TR x1000", value: Number(designTR * 1000) },
    { name: "CFM", value: Number(airFlowCFM) },
  ];

  const fanChart = generateFanChartData(airFlowCFM, 600);

  const printReport = () => window.print();

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Complete Automatic AHU Project Report</h1>

      <button onClick={printReport} style={styles.button}>
        Print / Save as PDF
      </button>

      <div style={styles.report}>
        <h2 style={styles.title}>HVAC AHU DESIGN REPORT</h2>

        <Section title="1. Project Information">
          <Row label="Project Name" value={projectData.projectName || "-"} />
          <Row label="Client Name" value={projectData.clientName || "-"} />
          <Row label="Location" value={projectData.location || "-"} />
          <Row label="Room Name" value={projectData.roomName || "-"} />
        </Section>

        <Section title="2. Project Input Data">
          <Row label="Room Length" value={`${projectData.roomLength} m`} />
          <Row label="Room Width" value={`${projectData.roomWidth} m`} />
          <Row label="Room Height" value={`${projectData.roomHeight} m`} />
          <Row label="People Count" value={`${projectData.peopleCount} Nos`} />
          <Row label="Lighting Load" value={`${projectData.lightingLoad} W`} />
          <Row label="Equipment Load" value={`${projectData.equipmentLoad} W`} />
          <Row label="Indoor Temperature" value={`${projectData.indoorTemp} °C`} />
          <Row label="Outdoor Temperature" value={`${projectData.outdoorTemp} °C`} />
          <Row label="Relative Humidity" value={`${projectData.relativeHumidity} %`} />
        </Section>

        <Section title="3. Construction Data">
          <Row label="Wall U Value" value={`${projectData.wallU} W/m²K`} />
          <Row label="Roof U Value" value={`${projectData.roofU} W/m²K`} />
          <Row label="Glass U Value" value={`${projectData.glassU} W/m²K`} />
          <Row label="Glass Area" value={`${projectData.glassArea} m²`} />
          <Row label="Solar Factor" value={`${projectData.solarFactor} W/m²`} />
          <Row label="Wall Area" value={`${designResult.wallArea} m²`} />
          <Row label="Roof Area" value={`${designResult.roofArea} m²`} />
          <Row label="Floor Area" value={`${designResult.floorArea} m²`} />
          <Row label="Room Volume" value={`${designResult.volume} m³`} />
        </Section>

        <Section title="4. Heat Load Calculation Output">
          <Row label="People Sensible Load" value={`${designResult.peopleSensible} W`} />
          <Row label="People Latent Load" value={`${designResult.peopleLatent} W`} />
          <Row label="Lighting Load" value={`${designResult.lightingLoad} W`} />
          <Row label="Equipment Load" value={`${designResult.equipmentLoad} W`} />
          <Row label="Wall Load" value={`${designResult.wallLoad} W`} />
          <Row label="Roof Load" value={`${designResult.roofLoad} W`} />
          <Row label="Glass Transmission Load" value={`${designResult.glassTransmissionLoad} W`} />
          <Row label="Solar Load" value={`${designResult.solarLoad} W`} />
          <Row label="Fresh Air" value={`${designResult.freshAirCFM} CFM`} />
          <Row label="Fresh Air Sensible Load" value={`${designResult.freshAirSensible} W`} />
          <Row label="Fresh Air Latent Load" value={`${designResult.freshAirLatent} W`} />
          <Row label="Total Sensible Load" value={`${designResult.totalSensible} W`} />
          <Row label="Total Latent Load" value={`${designResult.totalLatent} W`} />
          <Row label="Total Heat Load" value={`${designResult.totalWatts} W`} />
          <Row label="Total Cooling Load" value={`${designResult.totalTR} TR`} />
          <Row label="Design Cooling Load" value={`${designResult.designTR} TR`} />
          <Row label="Required Air Flow" value={`${designResult.requiredCFM} CFM`} />
        </Section>

        <Section title="5. Advanced Psychrometric Output">
          <Row label="Indoor DBT" value={`${designResult.indoorDBT} °C`} />
          <Row label="Outdoor DBT" value={`${designResult.outdoorDBT} °C`} />
          <Row label="Indoor RH" value={`${designResult.indoorRH} %`} />
          <Row label="Outdoor RH" value={`${designResult.outdoorRH} %`} />
          <Row label="Indoor Humidity Ratio" value={`${designResult.indoorHumidityRatio} g/kg`} />
          <Row label="Outdoor Humidity Ratio" value={`${designResult.outdoorHumidityRatio} g/kg`} />
          <Row label="Indoor Enthalpy" value={`${designResult.indoorEnthalpy} kJ/kg`} />
          <Row label="Outdoor Enthalpy" value={`${designResult.outdoorEnthalpy} kJ/kg`} />
          <Row label="Indoor Dew Point" value={`${designResult.indoorDewPoint} °C`} />
          <Row label="Outdoor Dew Point" value={`${designResult.outdoorDewPoint} °C`} />
        </Section>

        <Section title="6. Advanced HVAC Engineering Output">
          <Row label="Sensible Heat Ratio (SHR)" value={`${designResult.SHR}`} />
          <Row label="Room Air Changes Per Hour" value={`${designResult.roomACH} ACH`} />
          <Row label="Total Cooling Load" value={`${designResult.totalKW} kW`} />
          <Row label="Fresh Air Requirement" value={`${designResult.freshAirCFM} CFM`} />
          <Row label="Temperature Difference ΔT" value={`${designResult.deltaT} °C`} />
        </Section>

        <Section title="7. Coil Engineering Output">
          <Row label="Cooling Coil Capacity" value={`${designResult.coilTR} TR`} />
          <Row label="Cooling Coil Capacity" value={`${designResult.coilKW} kW`} />
          <Row label="Chilled Water Flow" value={`${designResult.chilledWaterFlowLPM} LPM`} />
          <Row
            label="Estimated Coil Face Area"
            value={`${(Number(designResult.requiredCFM || 0) / 500).toFixed(2)} ft²`}
          />
        </Section>

        <Section title="8. AHU Selection Output">
          <Row label="AHU Length" value={`${designResult.ahuLength} mm`} />
          <Row label="AHU Width" value={`${designResult.ahuWidth} mm`} />
          <Row label="AHU Height" value={`${designResult.ahuHeight} mm`} />
          <Row label="Coil Capacity" value={`${designResult.coilTR} TR`} />
          <Row label="Blower Air Flow" value={`${designResult.blowerCFM} CFM`} />
          <Row label="Filter Air Flow" value={`${designResult.filterCFM} CFM`} />
          <Row label="Duct Air Flow" value={`${designResult.ductCFM} CFM`} />
        </Section>

        <Section title="9. Heat Load Pie Chart">
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie data={heatLoadPie} dataKey="value" nameKey="name" outerRadius={110} label>
                <Cell fill="#e60000" />
                <Cell fill="#2563eb" />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Section>

        <Section title="10. Load Comparison Chart">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={loadBar}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#e60000" />
            </BarChart>
          </ResponsiveContainer>
        </Section>

        <Section title="11. Psychrometric Chart">
          <ProfessionalPsychrometricChart
            dryBulbTemp={Number(projectData.indoorTemp || 24)}
            relativeHumidity={Number(projectData.relativeHumidity || 55)}
            humidityRatio={Number(designResult.indoorHumidityRatio || 10)}
          />
        </Section>

        <Section title="12. Fan Performance Chart">
          <ResponsiveContainer width="100%" height={340}>
            <LineChart data={fanChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="cfm" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="staticPressure"
                stroke="#e60000"
                strokeWidth={3}
                name="Static Pressure Pa"
              />
              <Line
                type="monotone"
                dataKey="powerKW"
                stroke="#2563eb"
                strokeWidth={3}
                name="Power kW"
              />
            </LineChart>
          </ResponsiveContainer>
        </Section>

        <Section title="13. Equipment / BOM Summary">
          <Row label="AHU Casing" value={`${designResult.ahuLength} × ${designResult.ahuWidth} × ${designResult.ahuHeight} mm`} />
          <Row label="Pre Filter" value={`${designResult.filterCFM} CFM rated`} />
          <Row label="Cooling Coil" value={`${designResult.coilTR} TR / ${designResult.coilKW} kW`} />
          <Row label="Blower" value={`${designResult.blowerCFM} CFM`} />
          <Row label="Duct" value={`${designResult.ductCFM} CFM`} />
          <Row label="Chilled Water Flow" value={`${designResult.chilledWaterFlowLPM} LPM`} />
        </Section>

        <Section title="14. Engineering Notes">
          <p style={styles.note}>
            This report is automatically generated from the master HVAC AHU design engine.
            Final manufacturing, fan selection, coil selection, cleanroom validation, and
            equipment procurement must be verified with approved vendor data, site conditions,
            and project specifications.
          </p>
        </Section>
      </div>
    </div>
  );
}

function generateFanChartData(cfm, sp) {
  const data = [];
  const maxCFM = Math.max(cfm * 1.6, 3000);

  for (let i = 0; i <= 10; i++) {
    const flow = Math.round((maxCFM / 10) * i);
    const ratio = flow / (cfm || 1);

    data.push({
      cfm: flow,
      staticPressure: Math.max(
        0,
        Number((sp * (1.35 - 0.35 * ratio * ratio)).toFixed(0))
      ),
      powerKW: Number((3.7 * Math.pow(ratio, 3)).toFixed(2)),
    });
  }

  return data;
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h3 style={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div style={styles.row}>
      <strong>{label}</strong>
      <span>{value}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },

  heading: {
    fontSize: "38px",
    fontWeight: "800",
    color: "#111827",
    marginBottom: "18px",
  },

  button: {
    background: "#e60000",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "14px",
    padding: "14px 22px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
    marginBottom: "22px",
  },

  report: {
    background: "white",
    borderRadius: "20px",
    padding: "34px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  title: {
    textAlign: "center",
    color: "#111827",
    borderBottom: "3px solid #e60000",
    paddingBottom: "14px",
    marginBottom: "26px",
  },

  section: {
    marginBottom: "34px",
  },

  sectionTitle: {
    fontSize: "22px",
    color: "#e60000",
    borderBottom: "1px solid #d1d5db",
    paddingBottom: "8px",
    marginBottom: "14px",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "10px 0",
    gap: "20px",
  },

  note: {
    lineHeight: "1.7",
    color: "#374151",
    fontSize: "15px",
  },
};