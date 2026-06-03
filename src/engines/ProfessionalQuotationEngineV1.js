export function runProfessionalQuotationEngineV1({
  projectData = {},
  designResult = {},
  bom = null,
  costing = null,
  quotationSettings = {},
} = {}) {
  const quoteNo =
    quotationSettings.quoteNo ||
    `AG-QTN-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

  const validityDays = Number(quotationSettings.validityDays || 15);

  const quotationDate = new Date();
  const validityDate = new Date();
  validityDate.setDate(quotationDate.getDate() + validityDays);

  const currencySymbol = costing?.currencySymbol || "₹";
  const currency = costing?.currency || "INR";

  const sellingPrice = Number(costing?.totals?.sellingPrice || 0);
  const tax = Number(costing?.totals?.tax || 0);
  const beforeTax = Number(costing?.totals?.beforeTax || sellingPrice - tax);

  return {
    quoteNo,
    quotationDate: quotationDate.toLocaleDateString(),
    validityDate: validityDate.toLocaleDateString(),
    validityDays,

    company: {
      name: quotationSettings.companyName || "APFEL GLOBUS ENGINEERING",
      subtitle:
        quotationSettings.companySubtitle ||
        "Professional HVAC • AHU • Pharma Engineering Solutions",
      email: quotationSettings.companyEmail || "",
      phone: quotationSettings.companyPhone || "",
      address: quotationSettings.companyAddress || "",
    },

    customer: {
      name: projectData.clientName || "Client Name",
      projectName: projectData.projectName || "HVAC AHU Project",
      location: projectData.location || "-",
      roomName: projectData.roomName || "-",
    },

    technical: {
      airflowCFM: round(designResult.requiredCFM),
      coolingTR: round(designResult.designTR),
      ahuLength: round(designResult.ahuLength),
      ahuWidth: round(designResult.ahuWidth),
      ahuHeight: round(designResult.ahuHeight),
      motorHP: round(designResult.selectedMotorHP || designResult.motorHP),
      staticPressure: round(designResult.staticPressure),
      freshAirCFM: round(designResult.freshAirCFM),
    },

    commercial: {
      currency,
      currencySymbol,
      beforeTax: round(beforeTax),
      tax: round(tax),
      sellingPrice: round(sellingPrice),
      advancePercent: Number(quotationSettings.advancePercent || 50),
      deliveryWeeks: Number(quotationSettings.deliveryWeeks || 6),
    },

    bomItems: bom?.items || [],

    terms: quotationSettings.terms || [
      "Price is valid only up to the quotation validity date.",
      "Taxes, duties and transportation are extra unless mentioned.",
      "Delivery period will start after receipt of advance payment and technical approval.",
      "Any change in scope, quantity or technical specification may affect the price.",
      "Final design and dimensions are subject to approved GA drawing.",
      "Installation, commissioning and site work are excluded unless mentioned.",
      "Payment terms: 50% advance, 40% before dispatch, 10% after delivery.",
    ],
  };
}

function round(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Number(n.toFixed(2)) : 0;
}