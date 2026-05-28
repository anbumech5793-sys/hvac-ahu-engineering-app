import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  Legend,
} from "recharts";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalBlowerSelectionDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);

  const filterPD = Number(projectData.filterPD || 150);
  const coilPD = Number(projectData.coilPD || 120);
  const ductPD = Number(projectData.ductPD || 180);
  const diffuserPD = Number(projectData.diffuserPD || 50);
  const safetyPD = Number(projectData.safetyPD || 100);

  const fanEfficiency = Number(projectData.fanEfficiency || 65);
  const motorEfficiency = Number(projectData.motorEfficiency || 90);
  const outletVelocity = Number(projectData.outletVelocity || 10);

  const totalStaticPressure = filterPD + coilPD + ductPD + diffuserPD + safetyPD;
  const airFlowM3s = airFlowCFM * 0.000471947;
  const airPowerKW = (airFlowM3s * totalStaticPressure) / 1000;
  const shaftPowerKW = airPowerKW / (fanEfficiency / 100);
  const motorPowerKW = shaftPowerKW / (motorEfficiency / 100);
  const selectedMotorKW = selectMotorKW(motorPowerKW);

  const recommendedRPM =
    airFlowCFM <= 4000 ? 1440 : airFlowCFM <= 9000 ? 1200 : 960;

  const impellerDiameter = Math.round(350 + Math.sqrt(airFlowCFM) * 3.2);

  const fanClass =
    totalStaticPressure <= 750
      ? "Class I"
      : totalStaticPressure <= 1500
      ? "Class II"
      : "Class III";

  const driveType =
    selectedMotorKW <= 7.5 ? "Direct Drive / Plug Fan" : "Belt Drive / Coupled";

  const chartData = generateFanChartData(
    airFlowCFM,
    totalStaticPressure,
    selectedMotorKW,
    fanEfficiency
  );

  const handleChange = (e) => {
    updateProjectData({
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Blower Selection Dashboard</h1>

      <p style={styles.subHeading}>
        Blower selection and fan curve are automatically generated from CFM and static pressure.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
        <SummaryBox label="Static Pressure" value={totalStaticPressure.toFixed(2)} unit="Pa" />
        <SummaryBox label="Selected Motor" value={selectedMotorKW.toFixed(2)} unit="kW" />
        <SummaryBox label="RPM" value={recommendedRPM} unit="RPM" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Pressure Drop Inputs</h2>

        <div style={styles.grid}>
          <InputField label="Filter Pressure Drop" name="filterPD" unit="Pa" value={projectData.filterPD || 150} onChange={handleChange} />
          <InputField label="Coil Pressure Drop" name="coilPD" unit="Pa" value={projectData.coilPD || 120} onChange={handleChange} />
          <InputField label="Duct Pressure Drop" name="ductPD" unit="Pa" value={projectData.ductPD || 180} onChange={handleChange} />
          <InputField label="Diffuser Pressure Drop" name="diffuserPD" unit="Pa" value={projectData.diffuserPD || 50} onChange={handleChange} />
          <InputField label="Safety Margin" name="safetyPD" unit="Pa" value={projectData.safetyPD || 100} onChange={handleChange} />
          <InputField label="Fan Efficiency" name="fanEfficiency" unit="%" value={projectData.fanEfficiency || 65} onChange={handleChange} />
          <InputField label="Motor Efficiency" name="motorEfficiency" unit="%" value={projectData.motorEfficiency || 90} onChange={handleChange} />
          <InputField label="Outlet Velocity" name="outletVelocity" unit="m/s" value={projectData.outletVelocity || 10} onChange={handleChange} />
        </div>
      </div>

      <div style={styles.chartCard}>
        <h2 style={styles.resultHeading}>Automatic Fan Performance Chart</h2>

        <ResponsiveContainer width="100%" height={420}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="cfm"
              label={{
                value: "Air Flow (CFM)",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis
              yAxisId="left"
              label={{
                value: "Static Pressure (Pa)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              label={{
                value: "Power / Efficiency",
                angle: 90,
                position: "insideRight",
              }}
            />

            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="staticPressure"
              stroke="#e60000"
              strokeWidth={3}
              dot={false}
              name="Fan Static Pressure Curve"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="powerKW"
              stroke="#2563eb"
              strokeWidth={3}
              dot={false}
              name="Power Curve (kW)"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="efficiency"
              stroke="#16a34a"
              strokeWidth={3}
              dot={false}
              name="Efficiency (%)"
            />

            <ReferenceLine
              yAxisId="left"
              x={Number(airFlowCFM.toFixed(0))}
              stroke="#111827"
              strokeDasharray="5 5"
              label="Operating CFM"
            />

            <ReferenceLine
              yAxisId="left"
              y={Number(totalStaticPressure.toFixed(0))}
              stroke="#e60000"
              strokeDasharray="5 5"
              label="Operating SP"
            />
          </LineChart>
        </ResponsiveContainer>

        <div style={styles.chartNote}>
          <strong>Operating Point:</strong> {airFlowCFM.toFixed(0)} CFM @{" "}
          {totalStaticPressure.toFixed(0)} Pa
        </div>
      </div>

      <div style={styles.resultCard}>
        <h2 style={styles.resultHeading}>Automatic Blower Selection Result</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
          <ResultBox label="Air Flow" value={airFlowM3s.toFixed(3)} unit="m³/s" />
          <ResultBox label="Total Static Pressure" value={totalStaticPressure.toFixed(2)} unit="Pa" />
          <ResultBox label="Air Power" value={airPowerKW.toFixed(2)} unit="kW" />
          <ResultBox label="Shaft Power" value={shaftPowerKW.toFixed(2)} unit="kW" />
          <ResultBox label="Motor Power Required" value={motorPowerKW.toFixed(2)} unit="kW" />
          <ResultBox label="Selected Motor" value={selectedMotorKW.toFixed(2)} unit="kW" />
          <ResultBox label="Impeller Diameter" value={impellerDiameter} unit="mm" />
          <ResultBox label="Recommended Speed" value={recommendedRPM} unit="RPM" />
          <ResultBox label="Fan Class" value={fanClass} unit="" />
          <ResultBox label="Drive Type" value={driveType} unit="" />
        </div>
      </div>
    </div>
  );
}

function generateFanChartData(operatingCFM, operatingSP, selectedMotorKW, efficiency) {
  const data = [];
  const maxCFM = Math.max(operatingCFM * 1.6, 3000);

  for (let i = 0; i <= 12; i++) {
    const cfm = Math.round((maxCFM / 12) * i);
    const ratio = cfm / operatingCFM || 0;

    const staticPressure = Math.max(
      0,
      operatingSP * (1.35 - 0.35 * ratio * ratio)
    );

    const powerKW = selectedMotorKW * Math.pow(ratio, 3);

    const curveEfficiency =
      efficiency - Math.abs(ratio - 1) * 35;

    data.push({
      cfm,
      staticPressure: Number(staticPressure.toFixed(0)),
      powerKW: Number(powerKW.toFixed(2)),
      efficiency: Number(Math.max(20, curveEfficiency).toFixed(0)),
    });
  }

  return data;
}

function selectMotorKW(requiredKW) {
  const standardMotors = [
    0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3.7, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37,
    45, 55, 75,
  ];

  const withSafety = requiredKW * 1.15;
  return standardMotors.find((motor) => motor >= withSafety) || withSafety;
}

function InputField({ label, name, unit, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label} ({unit})</label>
      <input type="number" name={name} value={value ?? ""} onChange={onChange} style={styles.input} />
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
  summaryCard: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" },
  summaryBox: { background: "#111827", color: "white", borderRadius: "18px", padding: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px" },
  sectionTitle: { fontSize: "23px", color: "#111827", marginTop: "10px", marginBottom: "18px", borderBottom: "2px solid #e60000", paddingBottom: "8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "700", marginBottom: "8px", color: "#111827" },
  input: { padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "15px", background: "white" },
  chartCard: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)", marginBottom: "30px" },
  chartNote: { background: "#f3f4f6", borderRadius: "12px", padding: "14px", marginTop: "18px", fontSize: "16px" },
  resultCard: { background: "white", borderRadius: "20px", padding: "30px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
  resultHeading: { fontSize: "28px", color: "#111827", marginBottom: "20px" },
  resultGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  resultBox: { background: "#f3f4f6", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" },
};