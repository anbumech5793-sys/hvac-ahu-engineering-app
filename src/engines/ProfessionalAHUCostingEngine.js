export function calculateAHUCosting(data) {
  const errors = [];

  const casingCost = Number(data.casingCost);
  const coilCost = Number(data.coilCost);
  const blowerCost = Number(data.blowerCost);
  const motorCost = Number(data.motorCost);
  const filterCost = Number(data.filterCost);
  const damperCost = Number(data.damperCost);
  const electricalCost = Number(data.electricalCost);
  const labourCost = Number(data.labourCost);
  const packingTransportCost = Number(data.packingTransportCost);
  const testingCost = Number(data.testingCost);
  const overheadPercent = Number(data.overheadPercent);
  const profitPercent = Number(data.profitPercent);
  const gstPercent = Number(data.gstPercent);

  const values = [
    casingCost,
    coilCost,
    blowerCost,
    motorCost,
    filterCost,
    damperCost,
    electricalCost,
    labourCost,
    packingTransportCost,
    testingCost,
    overheadPercent,
    profitPercent,
    gstPercent,
  ];

  if (values.some((value) => value < 0)) {
    errors.push("Cost and percentage values cannot be negative.");
  }

  if (errors.length > 0) {
    return { status: "Invalid", errors };
  }

  const materialCost =
    casingCost +
    coilCost +
    blowerCost +
    motorCost +
    filterCost +
    damperCost +
    electricalCost;

  const manufacturingCost = labourCost + testingCost;
  const directCost = materialCost + manufacturingCost + packingTransportCost;

  const overheadAmount = (directCost * overheadPercent) / 100;
  const costBeforeProfit = directCost + overheadAmount;

  const profitAmount = (costBeforeProfit * profitPercent) / 100;
  const sellingPriceBeforeGST = costBeforeProfit + profitAmount;

  const gstAmount = (sellingPriceBeforeGST * gstPercent) / 100;
  const finalSellingPrice = sellingPriceBeforeGST + gstAmount;

  return {
    status: "Valid",
    materialCost: round(materialCost),
    manufacturingCost: round(manufacturingCost),
    packingTransportCost: round(packingTransportCost),
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