export const COUNTRY_PRICE_PRESETS = {
  India: {
    currency: "INR",
    currencySymbol: "₹",
    exchangeRateToINR: 1,
    gstPercent: 18,
    laborFactor: 0.18,
    fabricationFactor: 0.12,
    overheadFactor: 0.1,
    profitFactor: 0.2,
    aiMarketCorrection: 1.08,
    materials: {
      giSheetPerKg: 95,
      ss304PerKg: 285,
      ss316PerKg: 420,
      aluminumPerKg: 260,
      copperPerKg: 850,
      pufPanelPerSqm: 1850,
      rockwoolPanelPerSqm: 1550,
      insulationPerSqm: 450,
      preFilterPerSqm: 1800,
      fineFilterPerSqm: 4200,
      hepaFilterPerSqm: 14500,
      coolingCoilPerTR: 8500,
      fanPerCFM: 4.5,
      motorPerHP: 4200,
      damperPerSqm: 3500,
      electricalPanelBase: 35000,
      fastenersAndConsumablesFactor: 0.04,
    },
  },

  UAE: {
    currency: "AED",
    currencySymbol: "د.إ",
    exchangeRateToINR: 22.7,
    gstPercent: 5,
    laborFactor: 0.22,
    fabricationFactor: 0.15,
    overheadFactor: 0.12,
    profitFactor: 0.22,
    aiMarketCorrection: 1.12,
    materials: {
      giSheetPerKg: 5.2,
      ss304PerKg: 15.5,
      ss316PerKg: 23,
      aluminumPerKg: 14,
      copperPerKg: 42,
      pufPanelPerSqm: 95,
      rockwoolPanelPerSqm: 82,
      insulationPerSqm: 24,
      preFilterPerSqm: 95,
      fineFilterPerSqm: 220,
      hepaFilterPerSqm: 720,
      coolingCoilPerTR: 430,
      fanPerCFM: 0.24,
      motorPerHP: 230,
      damperPerSqm: 180,
      electricalPanelBase: 1800,
      fastenersAndConsumablesFactor: 0.05,
    },
  },

  Saudi: {
    currency: "SAR",
    currencySymbol: "ر.س",
    exchangeRateToINR: 22.2,
    gstPercent: 15,
    laborFactor: 0.24,
    fabricationFactor: 0.16,
    overheadFactor: 0.14,
    profitFactor: 0.24,
    aiMarketCorrection: 1.13,
    materials: {
      giSheetPerKg: 5,
      ss304PerKg: 15,
      ss316PerKg: 22,
      aluminumPerKg: 13,
      copperPerKg: 40,
      pufPanelPerSqm: 92,
      rockwoolPanelPerSqm: 80,
      insulationPerSqm: 23,
      preFilterPerSqm: 90,
      fineFilterPerSqm: 210,
      hepaFilterPerSqm: 690,
      coolingCoilPerTR: 410,
      fanPerCFM: 0.23,
      motorPerHP: 220,
      damperPerSqm: 175,
      electricalPanelBase: 1700,
      fastenersAndConsumablesFactor: 0.05,
    },
  },

  USA: {
    currency: "USD",
    currencySymbol: "$",
    exchangeRateToINR: 83,
    gstPercent: 0,
    laborFactor: 0.35,
    fabricationFactor: 0.22,
    overheadFactor: 0.18,
    profitFactor: 0.28,
    aiMarketCorrection: 1.18,
    materials: {
      giSheetPerKg: 2.4,
      ss304PerKg: 6.8,
      ss316PerKg: 9.8,
      aluminumPerKg: 5.8,
      copperPerKg: 10.5,
      pufPanelPerSqm: 48,
      rockwoolPanelPerSqm: 40,
      insulationPerSqm: 12,
      preFilterPerSqm: 42,
      fineFilterPerSqm: 95,
      hepaFilterPerSqm: 320,
      coolingCoilPerTR: 220,
      fanPerCFM: 0.11,
      motorPerHP: 125,
      damperPerSqm: 75,
      electricalPanelBase: 950,
      fastenersAndConsumablesFactor: 0.06,
    },
  },

  UK: {
    currency: "GBP",
    currencySymbol: "£",
    exchangeRateToINR: 105,
    gstPercent: 20,
    laborFactor: 0.38,
    fabricationFactor: 0.24,
    overheadFactor: 0.2,
    profitFactor: 0.3,
    aiMarketCorrection: 1.2,
    materials: {
      giSheetPerKg: 1.95,
      ss304PerKg: 5.8,
      ss316PerKg: 8.4,
      aluminumPerKg: 4.9,
      copperPerKg: 8.8,
      pufPanelPerSqm: 42,
      rockwoolPanelPerSqm: 36,
      insulationPerSqm: 10,
      preFilterPerSqm: 36,
      fineFilterPerSqm: 82,
      hepaFilterPerSqm: 285,
      coolingCoilPerTR: 190,
      fanPerCFM: 0.095,
      motorPerHP: 105,
      damperPerSqm: 65,
      electricalPanelBase: 820,
      fastenersAndConsumablesFactor: 0.06,
    },
  },
};

export function runProfessionalAIAHUCostingV2({
  projectData = {},
  designResult = {},
  country = "India",
  construction = "GI Powder Coated",
  filterGrade = "Pre + Fine",
  includeHEPA = false,
  customPrices = null,
} = {}) {
  const preset = COUNTRY_PRICE_PRESETS[country] || COUNTRY_PRICE_PRESETS.India;
  const prices = {
    ...preset.materials,
    ...(customPrices || {}),
  };

  const cfm = num(designResult.requiredCFM || projectData.requiredCFM || 2500);
  const tr = num(designResult.designTR || designResult.totalTR || 5);
  const ahuLengthM = num(designResult.ahuLength || 3600) / 1000;
  const ahuWidthM = num(designResult.ahuWidth || 1200) / 1000;
  const ahuHeightM = num(designResult.ahuHeight || 1500) / 1000;
  const motorHP = num(designResult.motorHP || designResult.selectedMotorHP || Math.max(cfm / 2500, 1));

  const panelAreaSqm = estimatePanelArea(ahuLengthM, ahuWidthM, ahuHeightM);
  const sheetWeightKg = estimateSheetWeight(panelAreaSqm, construction);
  const filterAreaSqm = estimateFilterArea(cfm);
  const damperAreaSqm = estimateDamperArea(cfm);

  const materialKey = getMaterialKey(construction);

  const casingCost =
    construction === "PUF Panel"
      ? panelAreaSqm * prices.pufPanelPerSqm
      : construction === "Rockwool Panel"
      ? panelAreaSqm * prices.rockwoolPanelPerSqm
      : sheetWeightKg * prices[materialKey];

  const insulationCost =
    construction === "GI Powder Coated" || construction === "SS304" || construction === "SS316"
      ? panelAreaSqm * prices.insulationPerSqm
      : 0;

  const preFilterCost = filterAreaSqm * prices.preFilterPerSqm;
  const fineFilterCost =
    filterGrade === "Pre + Fine" || filterGrade === "Pre + Fine + HEPA"
      ? filterAreaSqm * prices.fineFilterPerSqm
      : 0;

  const hepaCost =
    includeHEPA || filterGrade === "Pre + Fine + HEPA"
      ? filterAreaSqm * prices.hepaFilterPerSqm
      : 0;

  const coilCost = Math.max(tr, 1) * prices.coolingCoilPerTR;
  const fanCost = Math.max(cfm, 500) * prices.fanPerCFM;
  const motorCost = Math.max(motorHP, 1) * prices.motorPerHP;
  const damperCost = damperAreaSqm * prices.damperPerSqm;
  const electricalCost = prices.electricalPanelBase;

  const materialSubtotal =
    casingCost +
    insulationCost +
    preFilterCost +
    fineFilterCost +
    hepaCost +
    coilCost +
    fanCost +
    motorCost +
    damperCost +
    electricalCost;

  const consumablesCost =
    materialSubtotal * prices.fastenersAndConsumablesFactor;

  const correctedMaterialCost =
    (materialSubtotal + consumablesCost) * preset.aiMarketCorrection;

  const laborCost = correctedMaterialCost * preset.laborFactor;
  const fabricationCost = correctedMaterialCost * preset.fabricationFactor;
  const overheadCost =
    (correctedMaterialCost + laborCost + fabricationCost) *
    preset.overheadFactor;

  const manufacturingCost =
    correctedMaterialCost + laborCost + fabricationCost + overheadCost;

  const profit = manufacturingCost * preset.profitFactor;
  const beforeTax = manufacturingCost + profit;
  const tax = beforeTax * (preset.gstPercent / 100);
  const sellingPrice = beforeTax + tax;

  return {
    country,
    currency: preset.currency,
    currencySymbol: preset.currencySymbol,
    exchangeRateToINR: preset.exchangeRateToINR,
    aiPricingAccuracyNote:
      "Estimated costing based on country preset, material rates, AI market correction, labor, overhead and profit factors. For final quotation, update supplier rates in admin price database.",
    inputs: {
      cfm: round(cfm),
      tr: round(tr),
      ahuLengthM: round(ahuLengthM),
      ahuWidthM: round(ahuWidthM),
      ahuHeightM: round(ahuHeightM),
      motorHP: round(motorHP),
      panelAreaSqm: round(panelAreaSqm),
      sheetWeightKg: round(sheetWeightKg),
      filterAreaSqm: round(filterAreaSqm),
      damperAreaSqm: round(damperAreaSqm),
      construction,
      filterGrade,
      includeHEPA,
    },
    itemized: [
      item("Casing / Panel", casingCost, "AHU casing, panels and frame"),
      item("Insulation", insulationCost, "PUF/Rockwool/thermal insulation"),
      item("Pre Filter", preFilterCost, "G4 pre filter with frame"),
      item("Fine Filter", fineFilterCost, "F7/F8 fine filter with frame"),
      item("HEPA Filter", hepaCost, "Optional HEPA filter"),
      item("Cooling Coil", coilCost, "Cooling coil based on TR"),
      item("Fan", fanCost, "Fan based on CFM"),
      item("Motor", motorCost, "Motor based on HP"),
      item("Damper", damperCost, "Fresh/return/supply damper"),
      item("Electrical Panel", electricalCost, "Starter/VFD/control panel allowance"),
      item("Fasteners & Consumables", consumablesCost, "Hardware, sealant, gasket, paint"),
      item("AI Market Correction", correctedMaterialCost - materialSubtotal - consumablesCost, "Market fluctuation correction"),
    ],
    totals: {
      materialSubtotal: round(materialSubtotal),
      consumablesCost: round(consumablesCost),
      correctedMaterialCost: round(correctedMaterialCost),
      laborCost: round(laborCost),
      fabricationCost: round(fabricationCost),
      overheadCost: round(overheadCost),
      manufacturingCost: round(manufacturingCost),
      profit: round(profit),
      beforeTax: round(beforeTax),
      tax: round(tax),
      sellingPrice: round(sellingPrice),
      sellingPriceINR: round(sellingPrice * preset.exchangeRateToINR),
    },
    factors: {
      laborFactor: preset.laborFactor,
      fabricationFactor: preset.fabricationFactor,
      overheadFactor: preset.overheadFactor,
      profitFactor: preset.profitFactor,
      gstPercent: preset.gstPercent,
      aiMarketCorrection: preset.aiMarketCorrection,
    },
  };
}

function estimatePanelArea(length, width, height) {
  return 2 * (length * width + length * height + width * height);
}

function estimateSheetWeight(areaSqm, construction) {
  let kgPerSqm = 7.85;

  if (construction === "GI Powder Coated") kgPerSqm = 7.2;
  if (construction === "SS304") kgPerSqm = 8.0;
  if (construction === "SS316") kgPerSqm = 8.1;

  return areaSqm * kgPerSqm;
}

function estimateFilterArea(cfm) {
  const faceVelocityFPM = 450;
  const areaSqft = cfm / faceVelocityFPM;
  return areaSqft * 0.092903;
}

function estimateDamperArea(cfm) {
  const velocityFPM = 900;
  const areaSqft = cfm / velocityFPM;
  return areaSqft * 0.092903;
}

function getMaterialKey(construction) {
  if (construction === "SS304") return "ss304PerKg";
  if (construction === "SS316") return "ss316PerKg";
  if (construction === "Aluminum Profile") return "aluminumPerKg";
  return "giSheetPerKg";
}

function item(name, cost, note) {
  return {
    name,
    cost: round(cost),
    note,
  };
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round(value) {
  return Number(num(value).toFixed(2));
}