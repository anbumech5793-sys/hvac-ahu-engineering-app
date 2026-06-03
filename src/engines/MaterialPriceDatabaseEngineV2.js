import { supabase } from "../authEngine";
import { COUNTRY_PRICE_PRESETS } from "./ProfessionalAI_AHUCostingEngineV2";

export async function loadMaterialPricesFromDatabase(country = "India") {
  const preset = COUNTRY_PRICE_PRESETS[country] || COUNTRY_PRICE_PRESETS.India;

  const { data, error } = await supabase
    .from("material_prices")
    .select("*")
    .eq("country", country);

  if (error) {
    console.warn("Material price DB error:", error.message);
    return {
      prices: preset.materials,
      currency: preset.currency,
      currencySymbol: preset.currencySymbol,
      source: "preset_fallback",
    };
  }

  if (!data || data.length === 0) {
    return {
      prices: preset.materials,
      currency: preset.currency,
      currencySymbol: preset.currencySymbol,
      source: "preset_fallback",
    };
  }

  const dbPrices = {};

  data.forEach((row) => {
    dbPrices[row.material_key] = Number(row.price || 0);
  });

  return {
    prices: {
      ...preset.materials,
      ...dbPrices,
    },
    currency: preset.currency,
    currencySymbol: preset.currencySymbol,
    source: "database",
    rows: data,
  };
}

export function normalizeMaterialPricesToCustomPrices(materialPriceResult) {
  return materialPriceResult?.prices || null;
}