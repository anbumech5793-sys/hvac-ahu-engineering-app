import React from "react";
import { useProject } from "../context/ProjectContext";
import ProfessionalPsychrometricASHRAEChart from "./ProfessionalPsychrometricASHRAEChart";
import { exportProfessionalPDF } from "../engines/PDFReportEngine";

export default function ProfessionalProjectReportDashboard() {
  const { projectData, designResult } = useProject();

  const chartKey = JSON.stringify({ projectData, designResult });

  const heatLoadData = [
    { label: "People", value: n(designResult.peopleSensible) + n(designResult.peopleLatent) },
    { label: "Lighting", value: n(designResult.lightingLoad || projectData.lightingLoad) },
    { label: "Equipment", value: n(designResult.equipmentLoad || projectData.equipmentLoad) },
    { label: "Wall", value: n(designResult.wallLoad) },
    { label: "Roof", value: n(designResult.roofLoad) },
    { label: "Fresh Air", value: n(designResult.freshAirSensible) + n(designResult.freshAirLatent) },
  ];

  const sensibleLatentData = [
    { label: "Sensible", value: n(designResult.totalSensible) },
    { label: "Latent", value: n(designResult.totalLatent) },
  ];

  const airflowData = [
    { label: "Required CFM", value: n(designResult.requiredCFM) },
    { label: "Fresh Air", value: n(designResult.freshAirCFM) },
    { label: "Return Air", value: Math.max(n(designResult.requiredCFM) - n(designResult.freshAirCFM), 0) },
  ];

  const ahuData = [
    { label: "Length", value: n(designResult.ahuLength) },
    { label: "Width", value: n(designResult.ahuWidth) },
    { label: "Height", value: n(designResult.ahuHeight) },
  ];

  const systemData = [
    { label: "Design TR", value: n(designResult.designTR) },
    { label: "Coil kW", value: n(designResult.coilKW) },
    { label: "Motor HP", value: n(designResult.motorHP || designResult.selectedMotorHP) },
    { label: "ACH", value: n(designResult.roomACH) },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.actionBar}>
        <button
          style={styles.printButton}
          onClick={() =>
            exportProfessionalPDF(
              "professional-hvac-report",
              `${projectData.projectName || "HVAC_Report"}.pdf`
            )
          }
        >
          Export Professional PDF
        </button>
      </div>

      <div id="professional-hvac-report" style={styles.report}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.company}>APFEL GLOBUS ENGINEERING</h1>
            <p>Professional HVAC • AHU • Pharma Engineering Design Report</p>
          </div>
          <div style={styles.reportBox}>
            <b>Date:</b><br />{new Date().toLocaleDateString()}
          </div>
        </div>

        <Section title="1. Project Information">
          <InfoGrid>
            <Info label="Project Name" value={projectData.projectName} />
            <Info label="Client Name" value={projectData.clientName} />
            <Info label="Location" value={projectData.location} />
            <Info label="Room Name" value={projectData.roomName} />
          </InfoGrid>
        </Section>

        <Section title="2. ASHRAE Psychrometric Chart + Fan Curve">
          <ProfessionalPsychrometricASHRAEChart
            key={chartKey}
            projectData={projectData}
            designResult={designResult}
          />
        </Section>

        <Section title="3. Heat Load Breakdown Chart">
          <BarChart title="Heat Load Split" data={heatLoadData} unit="W" />
        </Section>

        <Section title="4. Sensible vs Latent Chart">
          <PieChart title="Sensible vs Latent Load" data={sensibleLatentData} unit="W" />
        </Section>

        <Section title="5. Airflow Summary Chart">
          <BarChart title="Airflow Distribution" data={airflowData} unit="CFM" />
        </Section>

        <Section title="6. AHU Size Chart">
          <BarChart title="AHU Dimension Comparison" data={ahuData} unit="mm" />
        </Section>

        <Section title="7. System Selection Chart">
          <BarChart title="System Selection Summary" data={systemData} unit="" />
        </Section>

        <Section title="8. Room Input Data">
          <InfoGrid>
            <Info label="Room Length" value={projectData.roomLength} unit="m" />
            <Info label="Room Width" value={projectData.roomWidth} unit="m" />
            <Info label="Room Height" value={projectData.roomHeight} unit="m" />
            <Info label="People Count" value={projectData.peopleCount} unit="Nos" />
            <Info label="Indoor Temp" value={projectData.indoorTemp} unit="°C" />
            <Info label="Outdoor Temp" value={projectData.outdoorTemp} unit="°C" />
            <Info label="RH" value={projectData.relativeHumidity} unit="%" />
            <Info label="Required Air Flow" value={designResult.requiredCFM} unit="CFM" />
          </InfoGrid>
        </Section>

        <Section title="9. Heat Load Summary">
          <InfoGrid>
            <Info label="Floor Area" value={designResult.floorArea} unit="m²" />
            <Info label="Room Volume" value={designResult.volume} unit="m³" />
            <Info label="Total Sensible Load" value={designResult.totalSensible} unit="W" />
            <Info label="Total Latent Load" value={designResult.totalLatent} unit="W" />
            <Info label="Total Heat Load" value={designResult.totalWatts} unit="W" />
            <Info label="Total Cooling Load" value={designResult.totalTR} unit="TR" />
            <Info label="Design Cooling Load" value={designResult.designTR} unit="TR" />
            <Info label="Fresh Air" value={designResult.freshAirCFM} unit="CFM" />
          </InfoGrid>
        </Section>

        <Section title="10. AHU Summary">
          <InfoGrid>
            <Info label="AHU Length" value={designResult.ahuLength} unit="mm" />
            <Info label="AHU Width" value={designResult.ahuWidth} unit="mm" />
            <Info label="AHU Height" value={designResult.ahuHeight} unit="mm" />
            <Info label="Motor HP" value={designResult.motorHP || designResult.selectedMotorHP} unit="HP" />
            <Info label="Motor kW" value={designResult.motorKW} unit="kW" />
          </InfoGrid>
        </Section>

        <Section title="11. Engineering Notes">
          <ul style={styles.notes}>
            <li>Charts update from live Project Input values.</li>
            <li>Psychrometric chart is ASHRAE-style engineering visualization.</li>
            <li>Fan curve is indicative; final fan must be verified with manufacturer curve.</li>
            <li>Final HVAC design must be checked by a qualified engineer.</li>
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
    </div>
  );
}

function InfoGrid({ children }) {
  return <div style={styles.infoGrid}>{children}</div>;
}

function Info({ label, value, unit }) {
  return (
    <div style={styles.infoBox}>
      <span>{label}</span>
      <strong>{value ?? "-"} {unit || ""}</strong>
    </div>
  );
}

function BarChart({ title, data, unit }) {
  const max = Math.max(...data.map((x) => n(x.value)), 1);

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <div style={styles.barChart}>
        {data.map((item) => {
          const value = n(item.value);
          const h = Math.max((value / max) * 220, value > 0 ? 8 : 2);
          return (
            <div key={item.label} style={styles.barItem}>
              <div style={styles.barValue}>{round(value)} {unit}</div>
              <div style={styles.barColumn}>
                <div style={{ ...styles.bar, height: h }} />
              </div>
              <div style={styles.barLabel}>{item.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PieChart({ title, data, unit }) {
  const total = data.reduce((s, x) => s + n(x.value), 0) || 1;
  let start = 0;

  return (
    <div style={styles.chartCard}>
      <h3 style={styles.chartTitle}>{title}</h3>
      <div style={styles.pieRow}>
        <svg width="260" height="260" viewBox="0 0 260 260">
          {data.map((item, index) => {
            const value = n(item.value);
            const angle = (value / total) * 360;
            const path = pieSlice(130, 130, 100, start, start + angle);
            start += angle;
            return (
              <path
                key={item.label}
                d={path}
                fill={index === 0 ? "#e60000" : "#111827"}
                stroke="white"
                strokeWidth="3"
              />
            );
          })}
          <circle cx="130" cy="130" r="55" fill="white" />
          <text x="130" y="125" textAnchor="middle" fontSize="18" fontWeight="900">
            {round(total)}
          </text>
          <text x="130" y="148" textAnchor="middle" fontSize="12">
            {unit}
          </text>
        </svg>

        <div style={styles.legend}>
          {data.map((item, index) => (
            <div key={item.label} style={styles.legendItem}>
              <span style={{ ...styles.legendColor, background: index === 0 ? "#e60000" : "#111827" }} />
              <b>{item.label}</b>: {round(item.value)} {unit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function pieSlice(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, endAngle);
  const end = polar(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? "0" : "1";
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

function polar(cx, cy, r, angle) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? x : 0;
}

function round(v) {
  return Number(n(v).toFixed(2));
}

const styles = {
  page: { minHeight: "100vh" },
  actionBar: { display: "flex", justifyContent: "flex-end", marginBottom: 20 },
  printButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: 14,
    padding: "14px 24px",
    fontSize: 16,
    fontWeight: 900,
    cursor: "pointer",
  },
  report: {
    background: "white",
    borderRadius: 20,
    padding: 36,
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    borderBottom: "4px solid #111827",
    paddingBottom: 20,
    marginBottom: 26,
  },
  company: { fontSize: 34, fontWeight: 900, color: "#111827", margin: 0 },
  reportBox: {
    minWidth: 220,
    background: "#f3f4f6",
    borderRadius: 14,
    padding: 16,
    textAlign: "right",
    lineHeight: 1.6,
  },
  section: { marginBottom: 28, pageBreakInside: "avoid" },
  sectionTitle: {
    fontSize: 22,
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: 8,
    marginBottom: 18,
  },
  infoGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 },
  infoBox: {
    background: "#f3f4f6",
    borderRadius: 14,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    minHeight: 74,
  },
  chartCard: {
    background: "#f9fafb",
    border: "1px solid #d1d5db",
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
  },
  chartTitle: { fontSize: 20, fontWeight: 900, color: "#111827", marginBottom: 18 },
  barChart: {
    height: 310,
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 14,
    borderLeft: "2px solid #111827",
    borderBottom: "2px solid #111827",
    padding: "20px 10px 10px",
  },
  barItem: {
    flex: 1,
    height: 270,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
  barValue: { fontSize: 12, fontWeight: 900, textAlign: "center", minHeight: 28 },
  barColumn: { height: 225, display: "flex", alignItems: "flex-end" },
  bar: {
    width: 42,
    background: "linear-gradient(180deg,#e60000,#7f1d1d)",
    borderRadius: "8px 8px 0 0",
    border: "1px solid #111827",
  },
  barLabel: { fontSize: 12, fontWeight: 800, textAlign: "center", minHeight: 32 },
  pieRow: { display: "flex", alignItems: "center", gap: 30 },
  legend: { display: "flex", flexDirection: "column", gap: 14, fontSize: 16 },
  legendItem: { display: "flex", alignItems: "center", gap: 10 },
  legendColor: { width: 18, height: 18, borderRadius: 4, display: "inline-block" },
  notes: { lineHeight: 1.8, color: "#374151", fontSize: 15 },
};