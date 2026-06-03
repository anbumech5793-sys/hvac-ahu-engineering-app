import React, { useEffect, useState } from "react";
import { supabase } from "../authEngine";
import { COUNTRY_PRICE_PRESETS } from "../engines/ProfessionalAI_AHUCostingEngineV2";

const MATERIALS = [
  ["giSheetPerKg", "GI Sheet", "kg"],
  ["ss304PerKg", "SS304 Sheet", "kg"],
  ["ss316PerKg", "SS316 Sheet", "kg"],
  ["aluminumPerKg", "Aluminum", "kg"],
  ["copperPerKg", "Copper", "kg"],
  ["pufPanelPerSqm", "PUF Panel", "m²"],
  ["rockwoolPanelPerSqm", "Rockwool Panel", "m²"],
  ["insulationPerSqm", "Insulation", "m²"],
  ["preFilterPerSqm", "Pre Filter", "m²"],
  ["fineFilterPerSqm", "Fine Filter", "m²"],
  ["hepaFilterPerSqm", "HEPA Filter", "m²"],
  ["coolingCoilPerTR", "Cooling Coil", "TR"],
  ["fanPerCFM", "Fan", "CFM"],
  ["motorPerHP", "Motor", "HP"],
  ["damperPerSqm", "Damper", "m²"],
  ["electricalPanelBase", "Electrical Panel Base", "set"],
];

export default function ProfessionalMaterialPriceDashboard() {
  const [country, setCountry] = useState("India");
  const [prices, setPrices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadPrices(country);
  }, [country]);

  async function loadPrices(selectedCountry) {
    setMessage("Loading material prices...");

    const { data, error } = await supabase
      .from("material_prices")
      .select("*")
      .eq("country", selectedCountry)
      .order("material_name", { ascending: true });

    if (error) {
      setMessage(error.message);
      return;
    }

    if (!data || data.length === 0) {
      await seedDefaultPrices(selectedCountry);
      return;
    }

    setPrices(data || []);
    setMessage("");
  }

  async function seedDefaultPrices(selectedCountry) {
    const preset = COUNTRY_PRICE_PRESETS[selectedCountry] || COUNTRY_PRICE_PRESETS.India;

    const rows = MATERIALS.map(([key, name, unit]) => ({
      country: selectedCountry,
      currency: preset.currency,
      material_key: key,
      material_name: name,
      unit,
      price: preset.materials[key] || 0,
      supplier_name: "",
      notes: "Default seeded price. Please update with supplier rate.",
    }));

    const { error } = await supabase
      .from("material_prices")
      .upsert(rows, { onConflict: "country,material_key" });

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Default material prices created.");
    await loadPrices(selectedCountry);
  }

  async function updatePrice(id, field, value) {
    setPrices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  }

  async function saveRow(row) {
    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("material_prices")
      .update({
        price: Number(row.price || 0),
        supplier_name: row.supplier_name || "",
        notes: row.notes || "",
        last_updated: new Date().toISOString(),
        updated_by: userData?.user?.id || null,
      })
      .eq("id", row.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage(`${row.material_name} price updated.`);
    await loadPrices(country);
  }

  async function resetCountryDefaults() {
    const ok = window.confirm(
      `Reset all ${country} material prices to default preset?`
    );

    if (!ok) return;

    const { error } = await supabase
      .from("material_prices")
      .delete()
      .eq("country", country);

    if (error) {
      setMessage(error.message);
      return;
    }

    await seedDefaultPrices(country);
  }

  const currency =
    COUNTRY_PRICE_PRESETS[country]?.currency ||
    prices?.[0]?.currency ||
    "INR";

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Professional Material Price Database V1</h1>

      <p style={styles.subHeading}>
        Admin-controlled country-wise material price database for AI AHU costing.
        Update prices using supplier rates to improve costing accuracy.
      </p>

      {message && <div style={styles.message}>{message}</div>}

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Country Price Database</h2>

        <div style={styles.topRow}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Country</label>

            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              style={styles.input}
            >
              {Object.keys(COUNTRY_PRICE_PRESETS).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.currencyBox}>
            Currency: <strong>{currency}</strong>
          </div>

          <button style={styles.redButton} onClick={resetCountryDefaults}>
            Reset Default Prices
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h2 style={styles.sectionTitle}>Material Price List</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Material</th>
              <th style={styles.th}>Unit</th>
              <th style={styles.th}>Currency</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Supplier</th>
              <th style={styles.th}>Notes</th>
              <th style={styles.th}>Last Updated</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>

          <tbody>
            {prices.map((row) => (
              <tr key={row.id}>
                <td style={styles.td}>{row.material_name}</td>
                <td style={styles.td}>{row.unit}</td>
                <td style={styles.td}>{row.currency}</td>

                <td style={styles.td}>
                  <input
                    type="number"
                    value={row.price}
                    onChange={(e) =>
                      updatePrice(row.id, "price", e.target.value)
                    }
                    style={styles.smallInput}
                  />
                </td>

                <td style={styles.td}>
                  <input
                    value={row.supplier_name || ""}
                    onChange={(e) =>
                      updatePrice(row.id, "supplier_name", e.target.value)
                    }
                    style={styles.smallInput}
                    placeholder="Supplier name"
                  />
                </td>

                <td style={styles.td}>
                  <input
                    value={row.notes || ""}
                    onChange={(e) =>
                      updatePrice(row.id, "notes", e.target.value)
                    }
                    style={styles.noteInput}
                    placeholder="Notes"
                  />
                </td>

                <td style={styles.td}>{formatDate(row.last_updated)}</td>

                <td style={styles.td}>
                  <button
                    style={styles.greenButton}
                    onClick={() => saveRow(row)}
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}

            {prices.length === 0 && (
              <tr>
                <td style={styles.td} colSpan="8">
                  No prices found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={styles.warningBox}>
        <strong>Important:</strong> For 90% accurate costing, update these prices
        using latest supplier quotations weekly or monthly. AI costing will use
        these prices as the main cost base.
      </div>
    </div>
  );
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
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

  topRow: {
    display: "flex",
    alignItems: "end",
    gap: "18px",
  },

  inputGroup: {
    display: "flex",
    flexDirection: "column",
    minWidth: "260px",
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

  currencyBox: {
    background: "#111827",
    color: "white",
    borderRadius: "14px",
    padding: "14px 20px",
    fontWeight: "800",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "1200px",
  },

  th: {
    background: "#111827",
    color: "white",
    padding: "14px",
    textAlign: "left",
  },

  td: {
    borderBottom: "1px solid #e5e7eb",
    padding: "12px",
    verticalAlign: "middle",
  },

  smallInput: {
    width: "150px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },

  noteInput: {
    width: "260px",
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    fontSize: "14px",
  },

  greenButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    padding: "10px 14px",
    fontWeight: "900",
    cursor: "pointer",
  },

  redButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "12px",
    padding: "13px 18px",
    fontWeight: "900",
    cursor: "pointer",
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