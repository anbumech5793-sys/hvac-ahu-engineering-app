import React, { useEffect, useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext";
import { runProfessionalBOMEngineV1 } from "../engines/ProfessionalBOMEngineV1";
import { runProfessionalAIAHUCostingV2 } from "../engines/ProfessionalAI_AHUCostingEngineV2";
import { runProfessionalQuotationEngineV1 } from "../engines/ProfessionalQuotationEngineV1";
import { exportProfessionalPDF } from "../engines/PDFReportEngine";
import {
  loadMaterialPricesFromDatabase,
  normalizeMaterialPricesToCustomPrices,
} from "../engines/MaterialPriceDatabaseEngineV2";

export default function ProfessionalQuotationDashboard() {
  const { projectData, designResult } = useProject();

  const [country, setCountry] = useState("India");
  const [validityDays, setValidityDays] = useState(15);
  const [advancePercent, setAdvancePercent] = useState(50);
  const [deliveryWeeks, setDeliveryWeeks] = useState(6);

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
      setMessage("Quotation is using Material Price Database.");
    } else {
      setMessage("Quotation is using default preset prices.");
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
      customPrices,
    });
  }, [projectData, designResult, country, customPrices]);

  const bom = useMemo(() => {
    return runProfessionalBOMEngineV1({
      projectData,
      designResult,
      costing,
    });
  }, [projectData, designResult, costing]);

  const quotation = useMemo(() => {
    return runProfessionalQuotationEngineV1({
      projectData,
      designResult,
      bom,
      costing,
      quotationSettings: {
        validityDays,
        advancePercent,
        deliveryWeeks,
      },
    });
  }, [
    projectData,
    designResult,
    bom,
    costing,
    validityDays,
    advancePercent,
    deliveryWeeks,
  ]);

  const symbol = quotation.commercial.currencySymbol;

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Auto Quotation Generator V1</h1>

      <p style={styles.subHeading}>
        Auto quotation generated from Project Data, BOM, AI Costing and Material Price Database.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Quotation Settings</h2>

        <div style={styles.grid}>
          <InputBox
            label="Country"
            type="select"
            value={country}
            onChange={setCountry}
            options={["India", "UAE", "Saudi", "USA", "UK"]}
          />

          <InputBox
            label="Validity Days"
            value={validityDays}
            onChange={setValidityDays}
          />

          <InputBox
            label="Advance Payment %"
            value={advancePercent}
            onChange={setAdvancePercent}
          />

          <InputBox
            label="Delivery Weeks"
            value={deliveryWeeks}
            onChange={setDeliveryWeeks}
          />
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

      <div style={styles.actionBar}>
        <button
          style={styles.greenButton}
          onClick={() =>
            exportProfessionalPDF(
              "professional-quotation",
              `${quotation.quoteNo}.pdf`
            )
          }
        >
          Export Quotation PDF
        </button>
      </div>

      <div id="professional-quotation" style={styles.quotation}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.company}>{quotation.company.name}</h1>
            <p style={styles.companySub}>{quotation.company.subtitle}</p>
          </div>

          <div style={styles.quoteBox}>
            <strong>Quotation No:</strong>
            <br />
            {quotation.quoteNo}
            <br />
            <strong>Date:</strong>
            <br />
            {quotation.quotationDate}
            <br />
            <strong>Valid Until:</strong>
            <br />
            {quotation.validityDate}
          </div>
        </div>

        <Section title="1. Customer & Project Details">
          <InfoGrid>
            <Info label="Client Name" value={quotation.customer.name} />
            <Info label="Project Name" value={quotation.customer.projectName} />
            <Info label="Location" value={quotation.customer.location} />
            <Info label="Room Name" value={quotation.customer.roomName} />
          </InfoGrid>
        </Section>

        <Section title="2. Technical Offer Summary">
          <InfoGrid>
            <Info label="Airflow" value={quotation.technical.airflowCFM} unit="CFM" />
            <Info label="Cooling Load" value={quotation.technical.coolingTR} unit="TR" />
            <Info
              label="AHU Size"
              value={`${quotation.technical.ahuLength} × ${quotation.technical.ahuWidth} × ${quotation.technical.ahuHeight}`}
              unit="mm"
            />
            <Info label="Motor HP" value={quotation.technical.motorHP} unit="HP" />
            <Info label="Static Pressure" value={quotation.technical.staticPressure} unit="mmWC" />
            <Info label="Fresh Air" value={quotation.technical.freshAirCFM} unit="CFM" />
          </InfoGrid>
        </Section>

        <Section title="3. Commercial Offer">
          <table style={styles.table}>
            <tbody>
              <PriceRow label="Basic Price Before Tax" value={`${symbol}${money(quotation.commercial.beforeTax)}`} />
              <PriceRow label="Tax / GST" value={`${symbol}${money(quotation.commercial.tax)}`} />
              <PriceRow label="Final Selling Price" value={`${symbol}${money(quotation.commercial.sellingPrice)}`} bold />
              <PriceRow label="Currency" value={quotation.commercial.currency} />
              <PriceRow label="Advance Payment" value={`${quotation.commercial.advancePercent}%`} />
              <PriceRow label="Delivery Period" value={`${quotation.commercial.deliveryWeeks} Weeks`} />
            </tbody>
          </table>
        </Section>

        <Section title="4. Scope of Supply / BOM">
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Sr No</th>
                <th style={styles.th}>Item</th>
                <th style={styles.th}>Specification</th>
                <th style={styles.th}>Qty</th>
                <th style={styles.th}>Unit</th>
              </tr>
            </thead>

            <tbody>
              {quotation.bomItems.map((item) => (
                <tr key={item.srNo}>
                  <td style={styles.td}>{item.srNo}</td>
                  <td style={styles.td}>{item.itemName}</td>
                  <td style={styles.td}>{item.specification}</td>
                  <td style={styles.td}>{item.quantity}</td>
                  <td style={styles.td}>{item.unit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Section>

        <Section title="5. Terms & Conditions">
          <ol style={styles.terms}>
            {quotation.terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ol>
        </Section>

        <div style={styles.signatureRow}>
          <div style={styles.signatureBox}>
            Prepared By
            <br />
            <br />
            ____________________
          </div>

          <div style={styles.signatureBox}>
            Client Approval
            <br />
            <br />
            ____________________
          </div>
        </div>
      </div>
    </div>
  );
}

function InputBox({ label, value, onChange, type, options = [] }) {
  return (
    <div style={styles.inputGroup}>
      <label style={styles.label}>{label}</label>

      {type === "select" ? (
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
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={styles.input}
          type="number"
        />
      )}
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
      <strong>
        {value ?? "-"} {unit || ""}
      </strong>
    </div>
  );
}

function PriceRow({ label, value, bold }) {
  return (
    <tr>
      <td style={{ ...styles.td, fontWeight: bold ? "900" : "700" }}>
        {label}
      </td>
      <td style={{ ...styles.td, fontWeight: bold ? "900" : "700" }}>
        {value}
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
    marginBottom: "24px",
  },

  actionBar: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "20px",
  },

  greenButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "14px",
    padding: "14px 24px",
    fontSize: "16px",
    fontWeight: "900",
    cursor: "pointer",
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

  quotation: {
    background: "white",
    borderRadius: "20px",
    padding: "36px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    borderBottom: "4px solid #111827",
    paddingBottom: "20px",
    marginBottom: "26px",
  },

  company: {
    fontSize: "34px",
    fontWeight: "900",
    color: "#111827",
    margin: 0,
  },

  companySub: {
    fontSize: "15px",
    color: "#374151",
    marginTop: "8px",
  },

  quoteBox: {
    minWidth: "250px",
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "16px",
    textAlign: "right",
    lineHeight: "1.6",
  },

  section: {
    marginBottom: "28px",
    pageBreakInside: "avoid",
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

  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "14px",
  },

  infoBox: {
    background: "#f3f4f6",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    minHeight: "74px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "900px",
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

  terms: {
    lineHeight: "1.9",
    fontSize: "15px",
    color: "#374151",
  },

  signatureRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "30px",
    marginTop: "50px",
  },

  signatureBox: {
    borderTop: "2px solid #111827",
    paddingTop: "18px",
    textAlign: "center",
    fontWeight: "900",
  },
};