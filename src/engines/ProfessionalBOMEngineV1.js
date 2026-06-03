export function runProfessionalBOMEngineV1({
  projectData = {},
  designResult = {},
  costing = null,
} = {}) {
  const cfm = n(designResult.requiredCFM, 2500);
  const tr = n(designResult.designTR || designResult.totalTR, 5);

  const ahuLength = n(designResult.ahuLength, 3600);
  const ahuWidth = n(designResult.ahuWidth, 1200);
  const ahuHeight = n(designResult.ahuHeight, 1500);

  const motorHP = n(designResult.selectedMotorHP || designResult.motorHP, 3);
  const staticPressure = n(designResult.staticPressure, 75);

  const panelArea = round(
    2 *
      ((ahuLength / 1000) * (ahuWidth / 1000) +
        (ahuLength / 1000) * (ahuHeight / 1000) +
        (ahuWidth / 1000) * (ahuHeight / 1000))
  );

  const filterArea = round((cfm / 450) * 0.092903);
  const coilFaceArea = round((cfm / 500) * 0.092903);
  const damperArea = round((cfm / 900) * 0.092903);

  const sheetWeight = round(panelArea * 7.2);
  const insulationArea = panelArea;
  const baseFrameLength = round(2 * ((ahuLength / 1000) + (ahuWidth / 1000)));

  const bom = [
    item(1, "AHU Casing Panel", "GI powder coated / insulated panel", panelArea, "m²", "Based on AHU outer surface area"),
    item(2, "GI Sheet / Panel Sheet", "1.2 mm GI sheet", sheetWeight, "kg", "Estimated sheet weight"),
    item(3, "Insulation", "PUF / Rockwool insulation", insulationArea, "m²", "For double skin panel"),
    item(4, "Base Frame", "75 × 50 × 3 mm RHS", baseFrameLength, "m", "AHU base frame"),
    item(5, "Fresh Air Damper", "Opposed blade damper", damperArea, "m²", "Fresh air inlet damper"),
    item(6, "Pre Filter", "G4 filter with frame", filterArea, "m²", "Pre filtration"),
    item(7, "Fine Filter", "F7/F8 filter with frame", filterArea, "m²", "Fine filtration"),
    item(8, "Cooling Coil", "Copper tube aluminium fin coil", tr, "TR", "Cooling coil capacity"),
    item(9, "Drain Pan", "SS drain pan with drain connection", 1, "set", "Below cooling coil"),
    item(10, "Centrifugal / Plug Fan", `${cfm} CFM @ ${staticPressure} mmWC`, 1, "set", "Fan selection as per airflow"),
    item(11, "Motor", `${motorHP} HP motor`, 1, "set", "Motor selected from blower calculation"),
    item(12, "Flexible Connector", "Canvas / neoprene connector", 1, "set", "At outlet connection"),
    item(13, "Access Doors", "Hinged access doors with handle", 4, "nos", "Filter, coil, fan and motor access"),
    item(14, "Fasteners", "SS/GI bolts, nuts, rivets", 1, "lot", "Assembly hardware"),
    item(15, "Gasket & Sealant", "EPDM gasket and PU sealant", 1, "lot", "Air leakage control"),
    item(16, "Electrical Panel", "Starter/VFD/control panel", 1, "set", "Fan motor control"),
  ];

  const summary = {
    totalItems: bom.length,
    airflowCFM: round(cfm),
    coolingTR: round(tr),
    ahuLength,
    ahuWidth,
    ahuHeight,
    panelArea,
    sheetWeight,
    filterArea,
    coilFaceArea,
    damperArea,
    motorHP,
    staticPressure,
    estimatedCost: costing?.totals?.sellingPrice || null,
    currency: costing?.currency || null,
    currencySymbol: costing?.currencySymbol || null,
  };

  return {
    summary,
    items: bom,
  };
}

function item(srNo, itemName, specification, quantity, unit, remarks) {
  return {
    srNo,
    itemName,
    specification,
    quantity: round(quantity),
    unit,
    remarks,
  };
}

function n(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function round(value) {
  return Number(n(value).toFixed(2));
}