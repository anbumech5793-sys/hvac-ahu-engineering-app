// ProfessionalAHUCostingEngine.js
// HVAC AHU Costing Calculation Engine

export function calculateAHUCosting(input) {
  const {
    casingCost,
    coilCost,
    blowerCost,
    motorCost,
    filterCost,
    damperCost,
    electricalCost,
    fabricationCost,
    paintingCost,
    labourCost,
    transportCost,
    testingCost,
    overheadPercent,
    profitPercent,
    gstPercent,
  } = input;

  const errors = [];

  const costFields = {
    casingCost,
    coilCost,
    blowerCost,
    motorCost,
    filterCost,
    damperCost,
    electricalCost,
    fabricationCost,
    paintingCost,
    labourCost,
    transportCost,
    testingCost,
  };

  Object.entries(costFields).forEach(([key, value]) => {
    if (value < 0) {
      errors.push(`${key} cannot be negative.`);
    }
  });

  if (overheadPercent < 0) errors.push("Overhead percentage cannot be negative.");
  if (profitPercent < 0) errors.push("Profit percentage cannot be negative.");
  if (gstPercent < 0) errors.push("GST percentage cannot be negative.");

  if (errors.length > 0) {
    return { errors };
  }

  const materialCost =
    casingCost +
    coilCost +
    blowerCost +
    motorCost +
    filterCost +
    damperCost +
    electricalCost;

  const manufacturingCost =
    fabricationCost + paintingCost + labourCost + testingCost;

  const directCost = materialCost + manufacturingCost + transportCost;

  const overheadAmount = (directCost * overheadPercent) / 100;
  const costBeforeProfit = directCost + overheadAmount;

  const profitAmount = (costBeforeProfit * profitPercent) / 100;
  const sellingPriceBeforeGST = costBeforeProfit + profitAmount;

  const gstAmount = (sellingPriceBeforeGST * gstPercent) / 100;
  const finalSellingPrice = sellingPriceBeforeGST + gstAmount;

  return {
    materialCost: round(materialCost),
    manufacturingCost: round(manufacturingCost),
    transportCost: round(transportCost),
    directCost: round(directCost),
    overheadAmount: round(overheadAmount),
    costBeforeProfit: round(costBeforeProfit),
    profitAmount: round(profitAmount),
    sellingPriceBeforeGST: round(sellingPriceBeforeGST),
    gstAmount: round(gstAmount),
    finalSellingPrice: round(finalSellingPrice),
    errors: [],
  };
}

function round(value) {
  return Number(value.toFixed(2));
}