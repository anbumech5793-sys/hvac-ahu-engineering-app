import React from "react";
import { useProject } from "../context/ProjectContext";

export default function ProfessionalBOMDashboard() {
  const { projectData, designResult } = useProject();

  const airFlowCFM = Number(designResult.requiredCFM || 0);
  const designTR = Number(designResult.designTR || 0);

  const ahuLength = Number(designResult.ahuLength || 0);
  const ahuWidth = Number(designResult.ahuWidth || 0);
  const ahuHeight = Number(designResult.ahuHeight || 0);

  const casingArea =
    (2 * (ahuLength * ahuWidth + ahuLength * ahuHeight + ahuWidth * ahuHeight)) /
    1000000;

  const sheetWeight = casingArea * 8;
  const insulationArea = casingArea;
  const frameWeight = ahuLength * 0.025;

  const filterSize = "610 x 610 mm";
  const filterQty = Math.max(1, Math.ceil(airFlowCFM / 2000));

  const filterPD = Number(projectData.filterPD || 150);
  const coilPD = Number(projectData.coilPD || 120);
  const ductPD = Number(projectData.ductPD || 180);
  const diffuserPD = Number(projectData.diffuserPD || 50);
  const safetyPD = Number(projectData.safetyPD || 100);

  const fanEfficiency = Number(projectData.fanEfficiency || 65);
  const motorEfficiency = Number(projectData.motorEfficiency || 90);

  const totalStaticPressure =
    filterPD + coilPD + ductPD + diffuserPD + safetyPD;

  const airFlowM3s = airFlowCFM * 0.000471947;

  const airPowerKW = (airFlowM3s * totalStaticPressure) / 1000;
  const shaftPowerKW = airPowerKW / (fanEfficiency / 100);
  const calculatedMotorKW = shaftPowerKW / (motorEfficiency / 100);

  const motorKW = selectMotorKW(calculatedMotorKW);
  const motorHP = motorKW / 0.746;

  const bomItems = [
    ["AHU Casing", `${ahuLength} x ${ahuWidth} x ${ahuHeight} mm`, "1 Set"],
    ["GI / Powder Coated Sheet", "Outer & inner skin", `${sheetWeight.toFixed(2)} kg`],
    ["PUF / Rockwool Insulation", "Double skin panel", `${insulationArea.toFixed(2)} m²`],
    ["Base Frame", "MS C-channel / RHS", `${frameWeight.toFixed(2)} kg`],
    ["Pre Filter", filterSize, `${filterQty} Nos`],
    ["Fine Filter", filterSize, `${filterQty} Nos`],
    ["Cooling Coil", `${designTR.toFixed(2)} TR`, "1 No"],
    ["Centrifugal / Plug Fan", `${airFlowCFM.toFixed(2)} CFM @ ${totalStaticPressure.toFixed(0)} Pa`, "1 No"],
    ["Motor", `${motorKW.toFixed(2)} kW / ${motorHP.toFixed(2)} HP`, "1 No"],
    ["RAD Damper", `${projectData.radSize || 450} mm`, "1 No"],
    ["SAD Damper", `${projectData.sadSize || 450} mm`, "1 No"],
    ["BOD Damper", `${projectData.bodSize || 255} mm`, "1 No"],
    ["Drain Pan", "SS-304", "1 No"],
    ["Access Door", "Hinged with gasket", "As required"],
    ["Fasteners", "SS / GI", "1 Lot"],
  ];

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional AHU BOM Dashboard</h1>

      <p style={styles.subHeading}>
        BOM is automatically generated from Project Input, Heat Load, CFM, TR,
        blower pressure drop and AHU GA sizing.
      </p>

      <div style={styles.summaryCard}>
        <Box label="Air Flow" value={airFlowCFM.toFixed(2)} unit="CFM" />
        <Box label="Cooling Load" value={designTR.toFixed(2)} unit="TR" />
        <Box label="Motor" value={`${motorKW.toFixed(2)} kW`} unit={`${motorHP.toFixed(2)} HP`} />
        <Box label="AHU Size" value={`${ahuLength} x ${ahuWidth} x ${ahuHeight}`} unit="mm" />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Automatic Equipment Summary</h2>

        <div style={styles.resultGrid}>
          <ResultBox label="Total Static Pressure" value={totalStaticPressure.toFixed(2)} unit="Pa" />
          <ResultBox label="Air Power" value={airPowerKW.toFixed(2)} unit="kW" />
          <ResultBox label="Shaft Power" value={shaftPowerKW.toFixed(2)} unit="kW" />
          <ResultBox label="Selected Motor" value={`${motorKW.toFixed(2)} kW / ${motorHP.toFixed(2)} HP`} unit="" />
          <ResultBox label="Filter Quantity" value={filterQty} unit="Nos" />
          <ResultBox label="Casing Area" value={casingArea.toFixed(2)} unit="m²" />
          <ResultBox label="Sheet Weight" value={sheetWeight.toFixed(2)} unit="kg" />
          <ResultBox label="Frame Weight" value={frameWeight.toFixed(2)} unit="kg" />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Automatic Bill of Materials</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Sr No</th>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Specification</th>
              <th style={styles.th}>Quantity</th>
            </tr>
          </thead>

          <tbody>
            {bomItems.map((item, index) => (
              <tr key={index}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{item[0]}</td>
                <td style={styles.td}>{item[1]}</td>
                <td style={styles.td}>{item[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function selectMotorKW(requiredKW) {
  const standardMotors = [
    0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3.7, 5.5,
    7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75,
  ];

  const withSafety = requiredKW * 1.15;

  return standardMotors.find((motor) => motor >= withSafety) || withSafety;
}

function Box({ label, value, unit }) {
  return (
    <div style={styles.box}>
      <span>{label}</span>
      <strong>
        {value} {unit}
      </strong>
    </div>
  );
}

function ResultBox({ label, value, unit }) {
  return (
    <div style={styles.resultBox}>
      <span>{label}</span>
      <strong>
        {value} {unit}
      </strong>
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

  box: {
    background: "#111827",
    color: "white",
    padding: "18px",
    borderRadius: "16px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  card: {
    background: "white",
    padding: "30px",
    borderRadius: "20px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
    marginBottom: "30px",
  },

  sectionTitle: {
    fontSize: "24px",
    borderBottom: "2px solid #e60000",
    paddingBottom: "8px",
    marginBottom: "20px",
  },

  resultGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },

  resultBox: {
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

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "14px",
  },
};