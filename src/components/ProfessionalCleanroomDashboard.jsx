import React, { useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext";
import {
  CLEANROOM_CLASSES,
  runProfessionalCleanroomEngineV1,
} from "../engines/ProfessionalCleanroomEngineV1";

export default function ProfessionalCleanroomDashboard() {
  const { projectData, designResult } = useProject();

  const [cleanroomClass, setCleanroomClass] = useState("ISO 7");
  const [roomPressureType, setRoomPressureType] = useState("Positive");
  const [exhaustPercent, setExhaustPercent] = useState(10);
  const [leakagePercent, setLeakagePercent] = useState(5);

  const cleanroom = useMemo(() => {
    return runProfessionalCleanroomEngineV1({
      projectData,
      designResult,
      cleanroomClass,
      roomPressureType,
      exhaustPercent,
      leakagePercent,
    });
  }, [
    projectData,
    designResult,
    cleanroomClass,
    roomPressureType,
    exhaustPercent,
    leakagePercent,
  ]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Cleanroom Module V1</h1>

      <p style={styles.subHeading}>
        ISO 14644 and EU GMP cleanroom airflow, ACH, pressure cascade, recovery
        time, HEPA requirement and particle limit calculator.
      </p>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cleanroom Design Inputs</h2>

        <div style={styles.grid}>
          <SelectBox
            label="Cleanroom Class"
            value={cleanroomClass}
            onChange={setCleanroomClass}
            options={Object.keys(CLEANROOM_CLASSES)}
          />

          <SelectBox
            label="Pressure Type"
            value={roomPressureType}
            onChange={setRoomPressureType}
            options={["Positive", "Negative"]}
          />

          <NumberBox
            label="Exhaust Air"
            value={exhaustPercent}
            onChange={setExhaustPercent}
            unit="%"
          />

          <NumberBox
            label="Leakage Allowance"
            value={leakagePercent}
            onChange={setLeakagePercent}
            unit="%"
          />
        </div>
      </div>

      <div style={styles.summaryCard}>
        <SummaryBox label="Class" value={cleanroom.cleanroomClass} />
        <SummaryBox label="Standard" value={cleanroom.standard} />
        <SummaryBox label="Supply Air" value={`${cleanroom.finalSupplyCFM} CFM`} />
        <SummaryBox label="ACH" value={`${cleanroom.calculatedACH} /hr`} />
        <SummaryBox label="Pressure" value={`${cleanroom.pressurePa} Pa`} />
        <SummaryBox label="Recovery Time" value={`${cleanroom.recoveryMinutes} min`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Room & Airflow Results</h2>

        <div style={styles.dataGrid}>
          <DataBox label="Floor Area" value={cleanroom.floorArea} unit="m²" />
          <DataBox label="Room Volume" value={cleanroom.roomVolume} unit="m³" />
          <DataBox label="Recommended ACH" value={cleanroom.recommendedACH} unit="/hr" />
          <DataBox label="Calculated ACH" value={cleanroom.calculatedACH} unit="/hr" />
          <DataBox label="Heat Load CFM" value={cleanroom.heatLoadCFM} unit="CFM" />
          <DataBox label="Cleanroom CFM" value={cleanroom.cleanroomCFM} unit="CFM" />
          <DataBox label="Final Supply CFM" value={cleanroom.finalSupplyCFM} unit="CFM" />
          <DataBox label="Return Air CFM" value={cleanroom.returnAirCFM} unit="CFM" />
          <DataBox label="Fresh Air CFM" value={cleanroom.freshAirCFM} unit="CFM" />
          <DataBox label="Exhaust CFM" value={cleanroom.exhaustCFM} unit="CFM" />
          <DataBox label="Leakage CFM" value={cleanroom.leakageCFM} unit="CFM" />
          <DataBox label="HEPA Requirement" value={cleanroom.hepaRequirement} />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Cleanroom Compliance Summary</h2>

        <table style={styles.table}>
          <tbody>
            <Row label="Cleanroom Class" value={cleanroom.cleanroomClass} />
            <Row label="Applicable Standard" value={cleanroom.standard} />
            <Row label="Particle Limit" value={cleanroom.particleLimit} />
            <Row label="Pressure Cascade" value={cleanroom.pressureCascade} />
            <Row label="HEPA Requirement" value={cleanroom.hepaRequirement} />
            <Row label="Recovery Time" value={`${cleanroom.recoveryMinutes} minutes`} />
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Airflow Distribution Chart</h2>

        <BarChart
          data={[
            { label: "Supply", value: cleanroom.finalSupplyCFM },
            { label: "Return", value: cleanroom.returnAirCFM },
            { label: "Fresh", value: cleanroom.freshAirCFM },
            { label: "Exhaust", value: cleanroom.exhaustCFM },
            { label: "Leakage", value: cleanroom.leakageCFM },
          ]}
          unit="CFM"
        />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Pressure Cascade Diagram</h2>

        <PressureDiagram
          type={cleanroom.roomPressureType}
          pressure={cleanroom.pressurePa}
        />
      </div>

      <div style={styles.warningBox}>
        <strong>Design Notes:</strong>
        <ul style={styles.notes}>
          {cleanroom.designNotes.map((note, index) => (
            <li key={index}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SelectBox({ label, value, onChange, options }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function NumberBox({ label, value, onChange, unit }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>
        {label} {unit ? `(${unit})` : ""}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={styles.input}
      />
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

function DataBox({ label, value, unit }) {
  return (
    <div style={styles.dataBox}>
      <span>{label}</span>
      <strong>
        {value ?? "-"} {unit || ""}
      </strong>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <tr>
      <td style={{ ...styles.td, fontWeight: "900" }}>{label}</td>
      <td style={styles.td}>{value}</td>
    </tr>
  );
}

function BarChart({ data, unit }) {
  const max = Math.max(...data.map((x) => Number(x.value || 0)), 1);

  return (
    <div style={styles.barChart}>
      {data.map((item) => {
        const value = Number(item.value || 0);
        const h = Math.max((value / max) * 220, value > 0 ? 8 : 2);

        return (
          <div key={item.label} style={styles.barItem}>
            <div style={styles.barValue}>
              {value.toFixed(2)} {unit}
            </div>

            <div style={styles.barColumn}>
              <div style={{ ...styles.bar, height: h }} />
            </div>

            <div style={styles.barLabel}>{item.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function PressureDiagram({ type, pressure }) {
  const sign = type === "Positive" ? "+" : "-";

  return (
    <svg viewBox="0 0 900 260" style={styles.svg}>
      <defs>
        <marker
          id="pressureArrow"
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L9,3 z" fill="#111827" />
        </marker>
      </defs>

      <rect x="320" y="70" width="260" height="120" fill="#e0f2fe" stroke="#0369a1" strokeWidth="4" />
      <text x="450" y="120" textAnchor="middle" fontSize="22" fontWeight="900">
        CLEANROOM
      </text>
      <text x="450" y="152" textAnchor="middle" fontSize="18" fontWeight="900">
        {sign}
        {pressure} Pa
      </text>

      <rect x="60" y="90" width="190" height="80" fill="#f3f4f6" stroke="#111827" strokeWidth="3" />
      <text x="155" y="138" textAnchor="middle" fontSize="16" fontWeight="900">
        CORRIDOR
      </text>

      <rect x="650" y="90" width="190" height="80" fill="#f3f4f6" stroke="#111827" strokeWidth="3" />
      <text x="745" y="138" textAnchor="middle" fontSize="16" fontWeight="900">
        ADJACENT ROOM
      </text>

      {type === "Positive" ? (
        <>
          <line x1="320" y1="130" x2="250" y2="130" stroke="#111827" strokeWidth="4" markerEnd="url(#pressureArrow)" />
          <line x1="580" y1="130" x2="650" y2="130" stroke="#111827" strokeWidth="4" markerEnd="url(#pressureArrow)" />
        </>
      ) : (
        <>
          <line x1="250" y1="130" x2="320" y2="130" stroke="#111827" strokeWidth="4" markerEnd="url(#pressureArrow)" />
          <line x1="650" y1="130" x2="580" y2="130" stroke="#111827" strokeWidth="4" markerEnd="url(#pressureArrow)" />
        </>
      )}

      <text x="450" y="225" textAnchor="middle" fontSize="14" fontWeight="800">
        {type === "Positive"
          ? "Positive pressure prevents contamination entering the cleanroom."
          : "Negative pressure contains contamination inside the room."}
      </text>
    </svg>
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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    fontWeight: "800",
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

  summaryCard: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
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

  dataGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },

  dataBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
    verticalAlign: "top",
  },

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

  barValue: {
    fontSize: 12,
    fontWeight: 900,
    textAlign: "center",
    minHeight: 28,
  },

  barColumn: {
    height: 225,
    display: "flex",
    alignItems: "flex-end",
  },

  bar: {
    width: 46,
    background: "linear-gradient(180deg,#2563eb,#1e3a8a)",
    borderRadius: "8px 8px 0 0",
    border: "1px solid #111827",
  },

  barLabel: {
    fontSize: 12,
    fontWeight: 800,
    textAlign: "center",
    minHeight: 32,
  },

  svg: {
    width: "100%",
    background: "white",
    border: "1px solid #d1d5db",
    borderRadius: "16px",
  },

  warningBox: {
    background: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "16px",
    padding: "18px",
    fontWeight: "700",
    marginBottom: "40px",
  },

  notes: {
    lineHeight: "1.8",
  },
};