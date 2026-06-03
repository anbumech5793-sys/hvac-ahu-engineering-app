import React, { useEffect, useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext";
import {
  COUNTRY_PRICE_PRESETS,
  runProfessionalAIAHUCostingV2,
} from "../engines/ProfessionalAI_AHUCostingEngineV2";
import {
  loadMaterialPricesFromDatabase,
  normalizeMaterialPricesToCustomPrices,
} from "../engines/MaterialPriceDatabaseEngineV2";

export default function ProfessionalAHUCostingDashboard() {
  const { projectData, designResult } = useProject();

  const [country, setCountry] = useState("India");
  const [construction, setConstruction] = useState("GI Powder Coated");
  const [filterGrade, setFilterGrade] = useState("Pre + Fine");
  const [includeHEPA, setIncludeHEPA] = useState(false);

  const [materialPriceResult, setMaterialPriceResult] = useState(null);
  const [loadingPrices, setLoadingPrices] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDatabasePrices(country);
  }, [country]);

  async function loadDatabasePrices(selectedCountry) {
    setLoadingPrices(true);
    setMessage("Loading latest material prices...");

    const result = await loadMaterialPricesFromDatabase(selectedCountry);

    setMaterialPriceResult(result);
    setLoadingPrices(false);

    if (result.source === "database") {
      setMessage("Using latest prices from Material Price Database.");
    } else {
      setMessage("Using default preset prices. Please update Material Price Database for better accuracy.");
    }
  }

  const customPrices = useMemo(() => {
    return normalizeMaterialPricesToCustomPrices(materialPriceResult);
  }, [materialPriceResult]);

  const costing = useMemo(() => {
    return runProfessionalAIAHUCostingV2({
      projectData,
      designResult,
      country,
      construction,
      filterGrade,
      includeHEPA,
      customPrices,
    });
  }, [
    projectData,
    designResult,
    country,
    construction,
    filterGrade,
    includeHEPA,
    customPrices,
  ]);

  const symbol = costing.currencySymbol;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>AI AHU Costing Dashboard V2</h1>

      <p style={styles.subHeading}>
        Country-wise AHU costing using Material Price Database, AI market correction,
        labor, overhead, tax and profit calculation.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Costing Settings</h2>

        <div style={styles.grid}>
          <SelectBox
            label="Country / Market"
            value={country}
            onChange={setCountry}
            options={Object.keys(COUNTRY_PRICE_PRESETS)}
          />

          <SelectBox
            label="Construction Type"
            value={construction}
            onChange={setConstruction}
            options={[
              "GI Powder Coated",
              "SS304",
              "SS316",
              "PUF Panel",
              "Rockwool Panel",
              "Aluminum Profile",
            ]}
          />

          <SelectBox
            label="Filter Grade"
            value={filterGrade}
            onChange={setFilterGrade}
            options={["Pre Only", "Pre + Fine", "Pre + Fine + HEPA"]}
          />

          <div style={styles.inputGroup}>
            <label style={styles.label}>HEPA Filter</label>
            <button
              style={includeHEPA ? styles.activeToggle : styles.toggle}
              onClick={() => setIncludeHEPA((v) => !v)}
            >
              {includeHEPA ? "Included" : "Not Included"}
            </button>
          </div>
        </div>

        <div style={styles.priceSourceBox}>
          Price Source:{" "}
          <strong>
            {loadingPrices
              ? "Loading..."
              : materialPriceResult?.source === "database"
              ? "Material Price Database"
              : "Default Preset Fallback"}
          </strong>

          <button
            style={styles.refreshButton}
            onClick={() => loadDatabasePrices(country)}
          >
            Refresh Prices
          </button>
        </div>
      </div>

      <div style={styles.summaryCard}>
        <SummaryBox label="Currency" value={costing.currency} />
        <SummaryBox label="Material Cost" value={`${symbol}${money(costing.totals.correctedMaterialCost)}`} />
        <SummaryBox label="Manufacturing Cost" value={`${symbol}${money(costing.totals.manufacturingCost)}`} />
        <SummaryBox label="Selling Price" value={`${symbol}${money(costing.totals.sellingPrice)}`} />
        <SummaryBox label="Selling Price INR" value={`₹${money(costing.totals.sellingPriceINR)}`} />
        <SummaryBox label="AI Correction" value={`${costing.factors.aiMarketCorrection}x`} />
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Project Costing Inputs</h2>

        <div style={styles.dataGrid}>
          <DataBox label="Airflow" value={costing.inputs.cfm} unit="CFM" />
          <DataBox label="Cooling Load" value={costing.inputs.tr} unit="TR" />
          <DataBox label="AHU Length" value={costing.inputs.ahuLengthM} unit="m" />
          <DataBox label="AHU Width" value={costing.inputs.ahuWidthM} unit="m" />
          <DataBox label="AHU Height" value={costing.inputs.ahuHeightM} unit="m" />
          <DataBox label="Motor HP" value={costing.inputs.motorHP} unit="HP" />
          <DataBox label="Panel Area" value={costing.inputs.panelAreaSqm} unit="m²" />
          <DataBox label="Sheet Weight" value={costing.inputs.sheetWeightKg} unit="kg" />
          <DataBox label="Filter Area" value={costing.inputs.filterAreaSqm} unit="m²" />
          <DataBox label="Damper Area" value={costing.inputs.damperAreaSqm} unit="m²" />
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Material Cost Breakdown</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Item</th>
              <th style={styles.th}>Cost</th>
              <th style={styles.th}>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {costing.itemized.map((item) => (
              <tr key={item.name}>
                <td style={styles.td}>{item.name}</td>
                <td style={styles.td}>{symbol}{money(item.cost)}</td>
                <td style={styles.td}>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Final Cost Summary</h2>

        <table style={styles.table}>
          <tbody>
            <CostRow label="Material Subtotal" value={costing.totals.materialSubtotal} symbol={symbol} />
            <CostRow label="Consumables" value={costing.totals.consumablesCost} symbol={symbol} />
            <CostRow label="Corrected Material Cost" value={costing.totals.correctedMaterialCost} symbol={symbol} />
            <CostRow label="Labor Cost" value={costing.totals.laborCost} symbol={symbol} />
            <CostRow label="Fabrication Cost" value={costing.totals.fabricationCost} symbol={symbol} />
            <CostRow label="Overhead Cost" value={costing.totals.overheadCost} symbol={symbol} />
            <CostRow label="Manufacturing Cost" value={costing.totals.manufacturingCost} symbol={symbol} />
            <CostRow label="Profit" value={costing.totals.profit} symbol={symbol} />
            <CostRow label="Before Tax" value={costing.totals.beforeTax} symbol={symbol} />
            <CostRow label={`Tax / GST (${costing.factors.gstPercent}%)`} value={costing.totals.tax} symbol={symbol} />
            <CostRow label="Final Selling Price" value={costing.totals.sellingPrice} symbol={symbol} bold />
          </tbody>
        </table>
      </div>

      <div style={styles.warningBox}>
        <strong>Important:</strong> {costing.aiPricingAccuracyNote}
        <br />
        <br />
        For best accuracy, update supplier rates in <strong>Material Price Database</strong>.
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
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
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

function CostRow({ label, value, symbol, bold }) {
  return (
    <tr>
      <td style={{ ...styles.td, fontWeight: bold ? "900" : "700" }}>
        {label}
      </td>
      <td style={{ ...styles.td, fontWeight: bold ? "900" : "700" }}>
        {symbol}{money(value)}
      </td>
    </tr>
  );
}

function money(value) {
  return Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
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

  message: {
    background: "#fef3c7",
    padding: "14px",
    borderRadius: "12px",
    marginBottom: "18px",
    fontWeight: "800",
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

  toggle: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    background: "#f3f4f6",
    fontWeight: "900",
    cursor: "pointer",
  },

  activeToggle: {
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #16a34a",
    background: "#16a34a",
    color: "white",
    fontWeight: "900",
    cursor: "pointer",
  },

  priceSourceBox: {
    marginTop: "22px",
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    fontWeight: "800",
  },

  refreshButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "900",
    cursor: "pointer",
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
    gridTemplateColumns: "repeat(5, 1fr)",
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

  warningBox: {
    background: "#fef3c7",
    border: "1px solid #f59e0b",
    borderRadius: "16px",
    padding: "18px",
    fontWeight: "700",
    marginBottom: "40px",
  },
};