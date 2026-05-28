import React, { useState } from "react";
import { formatFieldLabel } from "../utils/hvacFieldMeta";
import { calculateAHUCosting } from "../engines/ProfessionalAHUCostingEngine";

export default function ProfessionalAHUCostingDashboard() {
  const [form, setForm] = useState({
    casingCost: "50000",
    coilCost: "65000",
    blowerCost: "30000",
    motorCost: "18000",
    filterCost: "12000",
    damperCost: "8000",
    electricalCost: "15000",
    labourCost: "25000",
    packingTransportCost: "10000",
    testingCost: "5000",
    overheadPercent: "10",
    profitPercent: "20",
    gstPercent: "18",
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCalculate = () => {
    setResult(calculateAHUCosting(form));
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional AHU Costing Dashboard</h1>
      <p style={styles.subText}>
        Calculate AHU material cost, manufacturing cost, overhead, profit, GST,
        and final selling price.
      </p>

      <div style={styles.card}>
        <div style={styles.grid}>
          <InputField label="Casing / Sheet Metal Cost" name="casingCost" value={form.casingCost} onChange={handleChange} />
          <InputField label="Cooling Coil Cost" name="coilCost" value={form.coilCost} onChange={handleChange} />
          <InputField label="Blower Cost" name="blowerCost" value={form.blowerCost} onChange={handleChange} />
          <InputField label="Motor Cost" name="motorCost" value={form.motorCost} onChange={handleChange} />
          <InputField label="Filter Cost" name="filterCost" value={form.filterCost} onChange={handleChange} />
          <InputField label="Damper Cost" name="damperCost" value={form.damperCost} onChange={handleChange} />
          <InputField label="Electrical Cost" name="electricalCost" value={form.electricalCost} onChange={handleChange} />
          <InputField label="Labour Cost" name="labourCost" value={form.labourCost} onChange={handleChange} />
          <InputField label="Packing / Transport Cost" name="packingTransportCost" value={form.packingTransportCost} onChange={handleChange} />
          <InputField label="Testing Cost" name="testingCost" value={form.testingCost} onChange={handleChange} />
          <InputField label="Overhead" name="overheadPercent" value={form.overheadPercent} onChange={handleChange} unit="%" />
          <InputField label="Profit" name="profitPercent" value={form.profitPercent} onChange={handleChange} unit="%" />
          <InputField label="GST" name="gstPercent" value={form.gstPercent} onChange={handleChange} unit="%" />
        </div>

        <button onClick={handleCalculate} style={styles.button}>
          Calculate AHU Costing
        </button>
      </div>

      {result && (
        <div style={styles.resultCard}>
          <h2 style={styles.resultTitle}>AHU Costing Result</h2>

          {result.errors.length > 0 ? (
            <div style={styles.errorBox}>
              {result.errors.map((error, index) => (
                <p key={index}>• {error}</p>
              ))}
            </div>
          ) : (
            <>
              <ResultRow label="Material Cost" value={result.materialCost} />
              <ResultRow label="Manufacturing Cost" value={result.manufacturingCost} />
              <ResultRow label="Packing / Transport Cost" value={result.packingTransportCost} />
              <ResultRow label="Direct Cost" value={result.directCost} />
              <ResultRow label="Overhead Amount" value={result.overheadAmount} />
              <ResultRow label="Cost Before Profit" value={result.costBeforeProfit} />
              <ResultRow label="Profit Amount" value={result.profitAmount} />
              <ResultRow label="Selling Price Before GST" value={result.sellingPriceBeforeGST} />
              <ResultRow label="GST Amount" value={result.gstAmount} />
              <ResultRow label="Final Selling Price" value={result.finalSellingPrice} highlight />
            </>
          )}
        </div>
      )}
    </div>
  );
}

function InputField({ label, name, value, onChange, unit = "₹" }) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label} ({unit})
      </label>
      <input
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        style={styles.input}
      />
    </div>
  );
}

function ResultRow({ label, value, highlight }) {
  return (
    <div style={highlight ? styles.highlightRow : styles.row}>
      <strong>{label}</strong>
      <span>₹ {value}</span>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh" },
  heading: { fontSize: "34px", color: "#111827", marginBottom: "6px" },
  subText: { color: "#374151", marginBottom: "20px", fontSize: "17px" },
  card: {
    background: "white",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
    marginBottom: "24px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "18px",
  },
  field: { display: "flex", flexDirection: "column" },
  label: { fontWeight: "700", marginBottom: "6px", color: "#111827" },
  input: {
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "15px",
  },
  button: {
    marginTop: "22px",
    background: "#e60000",
    color: "white",
    border: "2px solid #ffcc00",
    borderRadius: "14px",
    padding: "14px 22px",
    fontSize: "16px",
    fontWeight: "800",
    cursor: "pointer",
  },
  resultCard: {
    background: "white",
    borderRadius: "18px",
    padding: "26px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
  },
  resultTitle: { color: "#111827" },
  row: {
    display: "flex",
    justifyContent: "space-between",
    borderBottom: "1px solid #e5e7eb",
    padding: "12px 0",
  },
  highlightRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px",
    marginTop: "10px",
    background: "#fee2e2",
    border: "2px solid #e60000",
    borderRadius: "12px",
    fontWeight: "800",
  },
  errorBox: {
    background: "#fee2e2",
    color: "#991b1b",
    padding: "14px",
    borderRadius: "12px",
  },
};