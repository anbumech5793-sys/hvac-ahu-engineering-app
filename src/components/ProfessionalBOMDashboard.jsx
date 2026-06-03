import React, { useMemo } from "react";
import { useProject } from "../context/ProjectContext";
import { runProfessionalBOMEngineV1 } from "../engines/ProfessionalBOMEngineV1";

export default function ProfessionalBOMDashboard() {
  const { projectData, designResult } = useProject();

  const bom = useMemo(() => {
    return runProfessionalBOMEngineV1({
      projectData,
      designResult,
    });
  }, [projectData, designResult]);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional BOM Generator V1</h1>

      <p style={styles.subHeading}>
        Automatic bill of materials generated from live AHU design data.
      </p>

      <div style={styles.summaryCard}>
        <SummaryBox label="Total Items" value={bom.summary.totalItems} />
        <SummaryBox label="Airflow" value={`${bom.summary.airflowCFM} CFM`} />
        <SummaryBox label="Cooling Load" value={`${bom.summary.coolingTR} TR`} />
        <SummaryBox label="Motor HP" value={`${bom.summary.motorHP} HP`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>BOM Summary</h2>

        <div style={styles.dataGrid}>
          <DataBox label="AHU Length" value={bom.summary.ahuLength} unit="mm" />
          <DataBox label="AHU Width" value={bom.summary.ahuWidth} unit="mm" />
          <DataBox label="AHU Height" value={bom.summary.ahuHeight} unit="mm" />
          <DataBox label="Panel Area" value={bom.summary.panelArea} unit="m²" />
          <DataBox label="Sheet Weight" value={bom.summary.sheetWeight} unit="kg" />
          <DataBox label="Filter Area" value={bom.summary.filterArea} unit="m²" />
          <DataBox label="Coil Face Area" value={bom.summary.coilFaceArea} unit="m²" />
          <DataBox label="Damper Area" value={bom.summary.damperArea} unit="m²" />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>AHU Bill of Materials</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr No</th>
              <th style={styles.th}>Item Name</th>
              <th style={styles.th}>Specification</th>
              <th style={styles.th}>Quantity</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {bom.items.map((item) => (
              <tr key={item.srNo}>
                <td style={styles.td}>{item.srNo}</td>
                <td style={styles.td}>{item.itemName}</td>
                <td style={styles.td}>{item.specification}</td>
                <td style={styles.td}>{item.quantity}</td>
                <td style={styles.td}>{item.unit}</td>
                <td style={styles.td}>{item.remarks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.warningBox}>
        <strong>Note:</strong> BOM is generated automatically from AHU airflow,
        cooling load, AHU size, fan and filter design. Final BOM should be
        checked before manufacturing or purchase.
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

function DataBox({ label, value, unit }) {
  return (
    <div style={styles.dataBox}>
      <span>{label}</span>
      <strong>{value} {unit}</strong>
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
    minWidth: "1100px",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
    verticalAlign: "top",
  },

  warningBox: {
    background: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "16px",
    padding: "18px",
    fontWeight: "700",
    marginBottom: "40px",
  },
};