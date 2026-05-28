import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalAHULayoutDashboard() {
  const { projectData, updateProjectData, designResult } = useProject();

  const data = {
    ahuLength: designResult.ahuLength,
    ahuWidth: designResult.ahuWidth,
    ahuHeight: designResult.ahuHeight,
    airflowCFM: designResult.requiredCFM,
    coolingTR: designResult.designTR,
    radSize: projectData.radSize || 450,
    sadSize: projectData.sadSize || 450,
    bodSize: projectData.bodSize || 255,
    motorKW: projectData.motorKW || 7.5,
    filterSection: projectData.filterSection || 450,
    coilSection: projectData.coilSection || 650,
    fanSection: projectData.fanSection || 950,
    client: projectData.clientName || "CLIENT NAME",
    project: projectData.projectName || "PROJECT NAME",
    drawingNo: projectData.drawingNo || "AHU-GA-001",
    date: projectData.date || new Date().toLocaleDateString(),
  };

  const update = (e) => {
    updateProjectData({ [e.target.name]: e.target.value });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Automatic AHU GA Drawing</h1>

      <p style={styles.subHeading}>
        AHU dimensions are automatically updated from Project Input, Heat Load, TR and CFM.
      </p>

      <div style={styles.summaryCard}>
        <Box label="Auto AHU Length" value={data.ahuLength} unit="mm" />
        <Box label="Auto AHU Width" value={data.ahuWidth} unit="mm" />
        <Box label="Auto AHU Height" value={data.ahuHeight} unit="mm" />
        <Box label="Air Flow" value={data.airflowCFM} unit="CFM" />
      </div>

      <div style={styles.card}>
        <div style={styles.grid}>
          <Input label="RAD Size" name="radSize" value={data.radSize} onChange={update} />
          <Input label="SAD Size" name="sadSize" value={data.sadSize} onChange={update} />
          <Input label="BOD Size" name="bodSize" value={data.bodSize} onChange={update} />
          <Input label="Motor kW" name="motorKW" value={data.motorKW} onChange={update} />
          <Input label="Drawing No" name="drawingNo" value={data.drawingNo} onChange={update} />
          <Input label="Date" name="date" value={data.date} onChange={update} />
        </div>
      </div>

      <div style={styles.drawingSheet}>
        <svg viewBox="0 0 1600 1050" width="100%" height="1050">
          <defs>
            <marker id="dimArrow" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="black" />
            </marker>

            <marker id="redArrow" markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
              <path d="M0,0 L10,5 L0,10 Z" fill="#d00000" />
            </marker>

            <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse">
              <path d="M0,7 L7,0" stroke="#444" strokeWidth="1" />
            </pattern>
          </defs>

          <rect x="10" y="10" width="1580" height="1030" fill="white" stroke="black" />

          <PlanView data={data} />
          <ElevationView data={data} />
          <TitleBlock data={data} />
          <Notes />
        </svg>
      </div>
    </div>
  );
}

function PlanView({ data }) {
  return (
    <>
      <Dimension x1={200} y1={70} x2={1080} y2={70} text={data.ahuLength} title="OVERALL LENGTH" />

      <rect x="200" y="210" width="880" height="220" fill="none" stroke="black" strokeWidth="2" />
      <rect x="208" y="218" width="864" height="204" fill="none" stroke="#777" />

      <SectionLines y1={210} y2={430} />

      <Duct x={140} y={315} label="RETURN / FRESH AIR" />
      <Duct x={1080} y={315} label="SUPPLY AIR" right />

      <Door x={260} y={165} />
      <Door x={520} y={165} />
      <Door x={800} y={165} />

      <Damper x={250} y={270} label="RAD" size={data.radSize} />
      <Filter x={360} y={225} />
      <Coil x={535} y={260} />
      <Fan x={760} y={320} />
      <Motor x={710} y={385} />
      <Bod x={880} y={290} size={data.bodSize} />
      <Damper x={1000} y={270} label="SAD" size={data.sadSize} />

      <FlowArrows y={470} x={300} />

      <VerticalDimension x={1150} y1={210} y2={430} text={data.ahuHeight} label="HEIGHT" />
      <text x="585" y="510" fontSize="18" fontWeight="700">PLAN VIEW</text>
    </>
  );
}

function ElevationView({ data }) {
  return (
    <>
      <Dimension x1={200} y1={560} x2={1080} y2={560} text={data.ahuLength} title="OVERALL LENGTH" />

      <rect x="200" y="620" width="880" height="190" fill="none" stroke="black" strokeWidth="2" />
      <rect x="208" y="628" width="864" height="174" fill="none" stroke="#777" />

      <SectionLines y1={620} y2={810} />

      <AccessDoor x={235} y={650} />
      <AccessDoor x={365} y={650} />
      <AccessDoor x={525} y={650} />
      <FanHousing x={720} y={690} />
      <AccessDoor x={990} y={650} />

      <BaseFrame x={185} y={810} />
      <Drain x={440} y={825} />

      <VerticalDimension x={120} y1={620} y2={810} text={data.ahuWidth} label="WIDTH" left />
      <text x="555" y="890" fontSize="18" fontWeight="700">FRONT ELEVATION VIEW</text>
    </>
  );
}

function SectionLines({ y1, y2 }) {
  return (
    <>
      {[330, 490, 670, 930, 1020].map((x) => (
        <line key={x} x1={x} y1={y1} x2={x} y2={y2} stroke="black" />
      ))}
    </>
  );
}

function Dimension({ x1, y1, x2, y2, text, title }) {
  return (
    <>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x={(x1 + x2) / 2} y={y1 - 22} fontSize="14" textAnchor="middle">{title}</text>
      <text x={(x1 + x2) / 2} y={y1 + 24} fontSize="22" fontWeight="700" textAnchor="middle">{text}</text>
    </>
  );
}

function VerticalDimension({ x, y1, y2, text, label, left }) {
  const tx = left ? x - 35 : x + 35;
  return (
    <>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="black" markerStart="url(#dimArrow)" markerEnd="url(#dimArrow)" />
      <text x={tx} y={(y1 + y2) / 2} fontSize="18" fontWeight="700" transform={`rotate(90 ${tx},${(y1 + y2) / 2})`}>
        {text}
      </text>
      <text x={left ? x - 65 : x + 65} y={(y1 + y2) / 2} fontSize="11" transform={`rotate(90 ${left ? x - 65 : x + 65},${(y1 + y2) / 2})`}>
        {label}
      </text>
    </>
  );
}

function Duct({ x, y, label, right }) {
  return (
    <>
      <rect x={x} y={y - 35} width="55" height="70" fill="none" stroke="black" />
      <line x1={right ? x + 10 : x - 35} y1={y} x2={right ? x + 75 : x + 15} y2={y} stroke="#d00000" strokeWidth="4" markerEnd="url(#redArrow)" />
      <text x={right ? x + 65 : x - 55} y={y + 55} fontSize="11" textAnchor="middle">{label}</text>
    </>
  );
}

function Door({ x, y }) {
  return (
    <>
      <line x1={x} y1={y + 50} x2={x + 75} y2={y + 50} stroke="black" />
      <path d={`M${x},${y + 50} Q${x + 25},${y} ${x + 75},${y + 18}`} fill="none" stroke="black" strokeDasharray="4 4" />
      <text x={x + 18} y={y + 10} fontSize="10">HINGED DOOR</text>
    </>
  );
}

function Damper({ x, y, label, size }) {
  return (
    <>
      <text x={x + 22} y={y - 10} fontSize="12" fontWeight="700">{label}</text>
      <rect x={x} y={y + 20} width="60" height="92" fill="none" stroke="black" />
      <line x1={x} y1={y + 20} x2={x + 60} y2={y + 112} stroke="black" />
      <line x1={x + 60} y1={y + 20} x2={x} y2={y + 112} stroke="black" />
      <text x={x + 18} y={y + 128} fontSize="10">{size} mm</text>
    </>
  );
}

function Filter({ x, y }) {
  return (
    <>
      <text x={x - 10} y={y - 10} fontSize="11">PRE FILTER</text>
      <rect x={x} y={y} width="32" height="185" fill="url(#hatch)" stroke="black" />
    </>
  );
}

function Coil({ x, y }) {
  return (
    <>
      <text x={x} y={y - 12} fontSize="11">COOLING COIL</text>
      <rect x={x} y={y} width="78" height="130" fill="none" stroke="black" />
      <rect x={x + 8} y={y + 10} width="62" height="110" fill="url(#hatch)" stroke="black" />
    </>
  );
}

function Fan({ x, y }) {
  return (
    <>
      <text x={x - 18} y={y - 62} fontSize="11">FAN</text>
      <circle cx={x} cy={y} r="55" fill="none" stroke="black" />
      <circle cx={x} cy={y} r="24" fill="none" stroke="black" />
      <circle cx={x} cy={y} r="10" fill="none" stroke="black" />
      <path d={`M${x},${y - 24} C${x + 42},${y - 38} ${x + 48},${y - 5} ${x + 18},${y + 8}`} fill="none" stroke="black" />
      <path d={`M${x + 22},${y + 8} C${x + 18},${y + 50} ${x - 25},${y + 45} ${x - 12},${y + 18}`} fill="none" stroke="black" />
      <path d={`M${x - 15},${y + 15} C${x - 55},${y + 10} ${x - 45},${y - 35} ${x - 10},${y - 20}`} fill="none" stroke="black" />
    </>
  );
}

function Motor({ x, y }) {
  return (
    <>
      <rect x={x} y={y} width="145" height="42" fill="none" stroke="black" />
      <text x={x + 55} y={y + 26} fontSize="12" fontWeight="700">MOTOR</text>
    </>
  );
}

function Bod({ x, y, size }) {
  return (
    <>
      <rect x={x} y={y} width="50" height="80" fill="none" stroke="black" />
      <text x={x + 13} y={y + 35} fontSize="12" fontWeight="700">BOD</text>
      <text x={x + 8} y={y + 55} fontSize="10">{size} mm</text>
    </>
  );
}

function AccessDoor({ x, y }) {
  return (
    <rect x={x} y={y} width="78" height="145" fill="none" stroke="black" />
  );
}

function FanHousing({ x, y }) {
  return (
    <>
      <path d={`M${x},${y + 110} L${x},${y + 40} Q${x + 80},${y - 25} ${x + 150},${y + 30} L${x + 150},${y + 110} Z`} fill="none" stroke="black" />
      <circle cx={x + 75} cy={y + 70} r="32" fill="none" stroke="black" />
    </>
  );
}

function BaseFrame({ x, y }) {
  return <rect x={x} y={y} width="910" height="14" fill="none" stroke="black" />;
}

function Drain({ x, y }) {
  return (
    <>
      <line x1={x} y1={y} x2={x} y2={y + 25} stroke="black" />
      <circle cx={x} cy={y + 25} r="5" fill="none" stroke="black" />
      <text x={x - 32} y={y + 45} fontSize="10">DRAIN</text>
    </>
  );
}

function FlowArrows({ y, x }) {
  return (
    <>
      {[0, 135, 270, 405, 540].map((offset) => (
        <line key={offset} x1={x + offset} y1={y} x2={x + offset + 80} y2={y} stroke="#d00000" strokeWidth="2.5" markerEnd="url(#redArrow)" />
      ))}
      <text x={x + 285} y={y + 30} fontSize="14" fontWeight="700" textAnchor="middle">AIR FLOW DIRECTION</text>
    </>
  );
}

function Notes() {
  return (
    <>
      <text x="35" y="900" fontSize="13" fontWeight="700">NOTES:</text>
      <text x="35" y="930" fontSize="12">1. Double skin construction with thermal break profile.</text>
      <text x="35" y="952" fontSize="12">2. Access doors shall be hinged type with gasket sealing.</text>
      <text x="35" y="974" fontSize="12">3. Drain pan shall be SS-304 with proper slope and drain connection.</text>
      <text x="35" y="996" fontSize="12">4. AHU size is automatically generated from CFM and TR.</text>
    </>
  );
}

function TitleBlock({ data }) {
  return (
    <>
      <rect x="1210" y="35" width="360" height="985" fill="none" stroke="black" />
      <Title y={70} text="AHU TECHNICAL DATA" />
      <Row y={115} label="L x W x H" value={`${data.ahuLength} x ${data.ahuWidth} x ${data.ahuHeight} mm`} />
      <Row y={155} label="Air Flow" value={`${data.airflowCFM} CFM`} />
      <Row y={195} label="Cooling Load" value={`${data.coolingTR} TR`} />
      <Row y={235} label="Motor" value={`${data.motorKW} kW`} />
      <Row y={275} label="RAD" value={`${data.radSize} mm`} />
      <Row y={315} label="SAD" value={`${data.sadSize} mm`} />
      <Row y={355} label="BOD" value={`${data.bodSize} mm`} />

      <Title y={760} text="TITLE BLOCK" />
      <Row y={805} label="Client" value={data.client} />
      <Row y={845} label="Project" value={data.project} />
      <Row y={885} label="Drawing" value={data.drawingNo} />
      <Row y={925} label="Date" value={data.date} />
      <text x="1230" y="1010" fontSize="11">ALL DIMENSIONS ARE IN MM</text>
    </>
  );
}

function Title({ y, text }) {
  return <text x="1390" y={y} fontSize="15" fontWeight="700" textAnchor="middle">{text}</text>;
}

function Row({ y, label, value }) {
  return (
    <>
      <line x1="1210" y1={y + 12} x2="1570" y2={y + 12} stroke="black" />
      <text x="1230" y={y} fontSize="12" fontWeight="700">{label}</text>
      <text x="1340" y={y} fontSize="12">{value}</text>
    </>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>
      <input name={name} value={value ?? ""} onChange={onChange} style={styles.input} />
    </div>
  );
}

function Box({ label, value, unit }) {
  return (
    <div style={styles.box}>
      <span>{label}</span>
      <strong>{value} {unit}</strong>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "38px", fontWeight: "800", color: "#111827", marginBottom: "8px" },
  subHeading: { fontSize: "17px", color: "#374151", marginBottom: "20px" },
  summaryCard: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "22px" },
  box: { background: "#111827", color: "white", padding: "18px", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "8px" },
  card: { background: "white", padding: "24px", borderRadius: "18px", marginBottom: "24px", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "700", marginBottom: "6px" },
  input: { padding: "10px", borderRadius: "10px", border: "1px solid #cbd5e1" },
  drawingSheet: { background: "white", padding: "20px", borderRadius: "12px", overflowX: "auto", boxShadow: "0 6px 20px rgba(0,0,0,0.15)" },
};