import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalAHUGADrawingDashboard() {
  const { designResult } = useProject();

  const cfm = Number(designResult.requiredCFM || 2500);
  const L = Number(designResult.ahuLength || 3600);
  const W = Number(designResult.ahuWidth || 1200);
  const H = Number(designResult.ahuHeight || 1500);

  const sections = [
    { key: "inlet", name: "INLET", sub: "LOUVER", width: 340, type: "damper" },
    { key: "mix", name: "MIXING", sub: "BOX", width: 430, type: "mixing" },
    { key: "prefilter", name: "PRE", sub: "FILTER G4", width: 370, type: "filter" },
    { key: "finefilter", name: "FINE", sub: "FILTER F7", width: 390, type: "filter" },
    { key: "coil", name: "COOLING", sub: "COIL", width: 650, type: "coil" },
    { key: "drain", name: "DRAIN", sub: "PAN", width: 260, type: "drain" },
    { key: "fan", name: "FAN", sub: "SECTION", width: 700, type: "fan" },
    { key: "motor", name: "MOTOR", sub: "DRIVE", width: 400, type: "motor" },
    { key: "outlet", name: "SUPPLY", sub: "PLENUM", width: 320, type: "outlet" },
  ];

  const totalStd = sections.reduce((s, x) => s + x.width, 0);
  const scale = 1010 / totalStd;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional AHU GA Drawing V4</h1>

      <p style={styles.subHeading}>
        Improved AHU GA with clear access doors, separate elevation and plan views,
        better spacing, airflow direction, dimensions, and non-overlapping labels.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Airflow" value={cfm.toFixed(2)} unit="CFM" />
        <SummaryBox label="Overall Length" value={L} unit="mm" />
        <SummaryBox label="Overall Width" value={W} unit="mm" />
        <SummaryBox label="Overall Height" value={H} unit="mm" />
      </div>

      <DrawingCard title="AHU Side Elevation - Access Door Side">
        <svg viewBox="0 0 1320 640" style={styles.svg}>
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <path d="M0,0 L0,6 L9,3 z" fill="#111827" />
            </marker>
          </defs>

          <TitleBlock title="AHU SIDE ELEVATION" x={910} y={35} />

          <rect x="90" y="155" width="1035" height="235" fill="#111827" />
          <rect x="104" y="168" width="1007" height="205" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
          <rect x="104" y="373" width="1007" height="38" fill="#cbd5e1" stroke="#111827" strokeWidth="2" />

          <AirArrow x1={25} y1={270} x2={95} y2={270} text="FRESH AIR IN" textY={246} />
          <AirArrow x1={1120} y1={270} x2={1270} y2={270} text="SUPPLY AIR OUT" textY={246} />

          <SectionsElevation sections={sections} scale={scale} />

          <DimensionLine x1={104} y1={460} x2={1111} y2={460} text={`OVERALL LENGTH = ${L} mm`} />
          <VerticalDimension x={1160} y1={168} y2={373} text={`HEIGHT = ${H} mm`} />

          <text x="110" y="438" fontSize="14" fontWeight="900">BASE FRAME: 75 × 50 × 3 mm RHS</text>
          <text x="110" y="505" fontSize="13" fontWeight="800">PANEL: 25/50 mm double skin insulated panel</text>
          <text x="110" y="530" fontSize="13" fontWeight="800">ACCESS DOORS: Hinged doors with handles for filter, coil, fan and motor maintenance</text>
          <text x="110" y="555" fontSize="13" fontWeight="800">DRAIN PAN: SS drain tray below coil with drain connection</text>
        </svg>
      </DrawingCard>

      <DrawingCard title="AHU Plan View - Top Layout">
        <svg viewBox="0 0 1320 560" style={styles.svg}>
          <TitleBlock title="AHU PLAN VIEW" x={910} y={35} />

          <rect x="104" y="165" width="1007" height="190" fill="#f8fafc" stroke="#111827" strokeWidth="4" />
          <rect x="104" y="355" width="1007" height="35" fill="#e5e7eb" stroke="#111827" strokeWidth="2" />

          <text x="110" y="130" fontSize="15" fontWeight="900">TOP VIEW: INTERNAL COMPONENT POSITION</text>
          <text x="110" y="420" fontSize="15" fontWeight="900">ACCESS DOOR SIDE / SERVICE CLEARANCE MINIMUM 900 mm</text>

          <SectionsPlan sections={sections} scale={scale} />

          <DimensionLine x1={104} y1={465} x2={1111} y2={465} text={`OVERALL LENGTH = ${L} mm`} />
          <VerticalDimension x={1160} y1={165} y2={355} text={`WIDTH = ${W} mm`} />

          <line x1="104" y1="145" x2="1111" y2="145" stroke="#111827" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x="610" y="135" textAnchor="middle" fontSize="13" fontWeight="900">
            AIR FLOW DIRECTION
          </text>
        </svg>
      </DrawingCard>

      <DrawingCard title="AHU Front View / Face Area">
        <svg viewBox="0 0 960 600" style={styles.svg}>
          <TitleBlockSmall title="AHU FRONT VIEW" />

          <rect x="280" y="130" width="360" height="270" fill="#111827" />
          <rect x="292" y="142" width="336" height="245" fill="#f8fafc" stroke="#111827" strokeWidth="3" />
          <rect x="292" y="387" width="336" height="42" fill="#cbd5e1" stroke="#111827" strokeWidth="2" />

          <rect x="345" y="195" width="230" height="125" fill="#ecfdf5" stroke="#047857" strokeWidth="3" />
          <line x1="345" y1="195" x2="575" y2="320" stroke="#047857" strokeWidth="3" />
          <line x1="575" y1="195" x2="345" y2="320" stroke="#047857" strokeWidth="3" />

          <text x="460" y="250" textAnchor="middle" fontSize="16" fontWeight="900">FILTER / COIL</text>
          <text x="460" y="274" textAnchor="middle" fontSize="13" fontWeight="800">FACE AREA</text>

          <VerticalDimension x={685} y1={142} y2={387} text={`HEIGHT = ${H} mm`} />
          <DimensionLine x1={292} y1={480} x2={628} y2={480} text={`WIDTH = ${W} mm`} />

          <text x="310" y="115" fontSize="14" fontWeight="900">DOUBLE SKIN PANEL CONSTRUCTION</text>
          <text x="355" y="455" fontSize="14" fontWeight="900">BASE FRAME</text>
        </svg>
      </DrawingCard>

      <DrawingCard title="Section Dimension Schedule">
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr No</th>
              <th style={styles.th}>AHU Section</th>
              <th style={styles.th}>Standard Length</th>
              <th style={styles.th}>Professional Component Details</th>
            </tr>
          </thead>

          <tbody>
            {sections.map((s, i) => (
              <tr key={s.key}>
                <td style={styles.td}>{i + 1}</td>
                <td style={styles.td}>{s.name} {s.sub}</td>
                <td style={styles.td}>{s.width} mm</td>
                <td style={styles.td}>{componentNote(s.type)}</td>
              </tr>
            ))}

            <tr>
              <td style={styles.td} colSpan="2"><strong>Total Standard Length</strong></td>
              <td style={styles.td}><strong>{totalStd} mm</strong></td>
              <td style={styles.td}>Displayed drawing is scaled to calculated AHU length.</td>
            </tr>
          </tbody>
        </table>
      </DrawingCard>
    </div>
  );
}

function SectionsElevation({ sections, scale }) {
  let x = 104;

  return sections.map((s) => {
    const w = s.width * scale;
    const cx = x + w / 2;

    const item = (
      <g key={s.key}>
        <rect x={x} y="168" width={w} height="205" fill="none" stroke="#111827" strokeWidth="2" />

        <AccessDoor x={x + 8} y={180} w={Math.max(w - 16, 28)} h={170} type={s.type} />

        <ComponentSymbol
          type={s.type}
          x={x + 16}
          y={198}
          w={Math.max(w - 32, 28)}
          h={90}
        />

        <rect x={x + 8} y="295" width={Math.max(w - 16, 28)} height="48" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />

        <text x={cx} y="315" textAnchor="middle" fontSize="10" fontWeight="900">{s.name}</text>
        <text x={cx} y="333" textAnchor="middle" fontSize="10" fontWeight="900">{s.sub}</text>
        <text x={cx} y="365" textAnchor="middle" fontSize="9" fontWeight="800">{s.width} mm</text>
      </g>
    );

    x += w;
    return item;
  });
}

function SectionsPlan({ sections, scale }) {
  let x = 104;

  return sections.map((s) => {
    const w = s.width * scale;
    const cx = x + w / 2;

    const item = (
      <g key={s.key}>
        <rect x={x} y="165" width={w} height="190" fill="none" stroke="#111827" strokeWidth="2" />

        <ComponentSymbol
          type={s.type}
          x={x + 16}
          y={190}
          w={Math.max(w - 32, 28)}
          h={92}
        />

        <PlanDoor x={x + 12} y={312} w={Math.max(w - 24, 30)} />

        <rect x={x + 8} y="286" width={Math.max(w - 16, 28)} height="24" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
        <text x={cx} y="303" textAnchor="middle" fontSize="9" fontWeight="900">{s.name}</text>
      </g>
    );

    x += w;
    return item;
  });
}

function ComponentSymbol({ type, x, y, w, h }) {
  if (type === "damper") return <DamperSymbol x={x} y={y} w={w} h={h} />;
  if (type === "filter") return <FilterSymbol x={x} y={y} w={w} h={h} />;
  if (type === "coil") return <CoilSymbol x={x} y={y} w={w} h={h} />;
  if (type === "drain") return <DrainSymbol x={x} y={y} w={w} h={h} />;
  if (type === "fan") return <FanSymbol x={x} y={y} w={w} h={h} />;
  if (type === "motor") return <MotorSymbol x={x} y={y} w={w} h={h} />;
  if (type === "outlet") return <OutletSymbol x={x} y={y} w={w} h={h} />;
  return <MixingSymbol x={x} y={y} w={w} h={h} />;
}

function AccessDoor({ x, y, w, h, type }) {
  const doorColor = ["filter", "coil", "fan", "motor"].includes(type)
    ? "#dbeafe"
    : "#f8fafc";

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill={doorColor} stroke="#334155" strokeWidth="1.5" />
      <line x1={x + 5} y1={y + 10} x2={x + 5} y2={y + h - 10} stroke="#111827" strokeWidth="2" />
      <line x1={x + 10} y1={y + 30} x2={x + 10} y2={y + 55} stroke="#111827" strokeWidth="2" />
      <line x1={x + 10} y1={y + h - 55} x2={x + 10} y2={y + h - 30} stroke="#111827" strokeWidth="2" />
      <circle cx={x + w - 12} cy={y + h / 2} r="4" fill="#111827" />
    </g>
  );
}

function PlanDoor({ x, y, w }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="26" fill="#dbeafe" stroke="#1e40af" strokeWidth="1.5" />
      <line x1={x + 8} y1={y + 26} x2={x + 40} y2={y + 46} stroke="#1e40af" strokeWidth="2" />
      <circle cx={x + w - 10} cy={y + 13} r="3" fill="#111827" />
    </g>
  );
}

function DamperSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fef3c7" stroke="#92400e" strokeWidth="2" />
      {[0.2, 0.4, 0.6, 0.8].map((p) => (
        <line key={p} x1={x + w * p - 12} y1={y + 8} x2={x + w * p + 12} y2={y + h - 8} stroke="#92400e" strokeWidth="3" />
      ))}
    </g>
  );
}

function FilterSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#dcfce7" stroke="#047857" strokeWidth="2" />
      <line x1={x} y1={y} x2={x + w} y2={y + h} stroke="#047857" strokeWidth="3" />
      <line x1={x + w} y1={y} x2={x} y2={y + h} stroke="#047857" strokeWidth="3" />
    </g>
  );
}

function CoilSymbol({ x, y, w, h }) {
  const lines = [];
  for (let i = 0; i < 8; i++) {
    const xx = x + 8 + (i * (w - 16)) / 7;
    lines.push(<line key={i} x1={xx} y1={y + 6} x2={xx} y2={y + h - 6} stroke="#0369a1" strokeWidth="2" />);
  }

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#e0f2fe" stroke="#0369a1" strokeWidth="2" />
      {lines}
      <path d={`M ${x + 8} ${y + h - 18} C ${x + w * 0.3} ${y + 8}, ${x + w * 0.7} ${y + h - 8}, ${x + w - 8} ${y + 18}`} fill="none" stroke="#ef4444" strokeWidth="3" />
    </g>
  );
}

function DrainSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f1f5f9" stroke="#475569" strokeWidth="2" />
      <path d={`M ${x + 5} ${y + h - 28} L ${x + w - 5} ${y + h - 28} L ${x + w - 24} ${y + h - 5} L ${x + 24} ${y + h - 5} Z`} fill="#e5e7eb" stroke="#111827" strokeWidth="2" />
      <text x={x + w / 2} y={y + 25} textAnchor="middle" fontSize="10" fontWeight="900">SS PAN</text>
    </g>
  );
}

function FanSymbol({ x, y, w, h }) {
  const cx = x + w / 2;
  const cy = y + h / 2;

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#fff7ed" stroke="#c2410c" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={Math.min(w, h) * 0.30} fill="none" stroke="#c2410c" strokeWidth="4" />
      <circle cx={cx} cy={cy} r="7" fill="#c2410c" />
      <path d={`M ${cx} ${cy} C ${cx + 30} ${cy - 30}, ${cx + 50} ${cy + 18}, ${cx + 8} ${cy + 30}`} fill="none" stroke="#c2410c" strokeWidth="5" />
      <rect x={cx + 22} y={cy - 16} width={Math.max(w * 0.25, 28)} height="32" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" />
    </g>
  );
}

function MotorSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x + 12} y={y + 22} width={Math.max(w - 24, 30)} height={Math.max(h - 44, 34)} rx="10" fill="#fee2e2" stroke="#991b1b" strokeWidth="2" />
      <text x={x + w / 2} y={y + h / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="900">MOTOR</text>
    </g>
  );
}

function OutletSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f1f5f9" stroke="#334155" strokeWidth="2" />
      <path d={`M ${x + 5} ${y + 10} L ${x + w - 5} ${y + h / 2} L ${x + 5} ${y + h - 10}`} fill="none" stroke="#334155" strokeWidth="3" />
    </g>
  );
}

function MixingSymbol({ x, y, w, h }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#f3f4f6" stroke="#4b5563" strokeWidth="2" />
      <line x1={x + 8} y1={y + 12} x2={x + w - 8} y2={y + h - 12} stroke="#4b5563" strokeWidth="3" />
      <line x1={x + w - 8} y1={y + 12} x2={x + 8} y2={y + h - 12} stroke="#4b5563" strokeWidth="3" />
    </g>
  );
}

function AirArrow({ x1, y1, x2, y2, text, textY }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111827" strokeWidth="3" markerEnd="url(#arrow)" />
      <text x={(x1 + x2) / 2} y={textY} textAnchor="middle" fontSize="12" fontWeight="900">{text}</text>
    </g>
  );
}

function DimensionLine({ x1, y1, x2, y2, text }) {
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#111827" strokeWidth="2" />
      <line x1={x1} y1={y1 - 10} x2={x1} y2={y1 + 10} stroke="#111827" strokeWidth="2" />
      <line x1={x2} y1={y2 - 10} x2={x2} y2={y2 + 10} stroke="#111827" strokeWidth="2" />
      <text x={(x1 + x2) / 2} y={y1 - 12} textAnchor="middle" fontSize="14" fontWeight="900">{text}</text>
    </g>
  );
}

function VerticalDimension({ x, y1, y2, text }) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke="#111827" strokeWidth="2" />
      <line x1={x - 10} y1={y1} x2={x + 10} y2={y1} stroke="#111827" strokeWidth="2" />
      <line x1={x - 10} y1={y2} x2={x + 10} y2={y2} stroke="#111827" strokeWidth="2" />
      <text x={x + 18} y={(y1 + y2) / 2} fontSize="13" fontWeight="900">{text}</text>
    </g>
  );
}

function TitleBlock({ title, x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="330" height="75" fill="#f8fafc" stroke="#111827" strokeWidth="2" />
      <text x={x + 15} y={y + 25} fontSize="16" fontWeight="900">{title}</text>
      <text x={x + 15} y={y + 50} fontSize="12" fontWeight="700">APFEL GLOBUS ENGINEERING OS</text>
      <text x={x + 255} y={y + 50} fontSize="12" fontWeight="700">NTS</text>
    </g>
  );
}

function TitleBlockSmall({ title }) {
  return (
    <g>
      <rect x="585" y="35" width="300" height="75" fill="#f8fafc" stroke="#111827" strokeWidth="2" />
      <text x="600" y="60" fontSize="16" fontWeight="900">{title}</text>
      <text x="600" y="85" fontSize="12" fontWeight="700">APFEL GLOBUS ENGINEERING OS</text>
    </g>
  );
}

function DrawingCard({ title, children }) {
  return (
    <div style={styles.card}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {children}
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

function componentNote(type) {
  if (type === "damper") return "Opposed blade damper / louver with flange connection.";
  if (type === "mixing") return "Fresh air and return air mixing chamber with access door.";
  if (type === "filter") return "Filter bank with holding frame, gasket and service access door.";
  if (type === "coil") return "Cooling coil with copper tubes, aluminium fins, header and drain tray.";
  if (type === "drain") return "SS drain pan with slope and drain connection.";
  if (type === "fan") return "Centrifugal / plug fan with anti-vibration mounting.";
  if (type === "motor") return "Motor base with belt/direct-drive arrangement.";
  return "Supply plenum / outlet with flexible connector.";
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
    overflowX: "auto",
  },

  sectionTitle: {
    fontSize: "24px",
    color: "#111827",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  svg: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
  },

  table: { width: "100%", borderCollapse: "collapse" },
  th: { background: "#111827", color: "white", padding: "14px", textAlign: "left" },
  td: { borderBottom: "1px solid #e5e7eb", padding: "14px" },
};