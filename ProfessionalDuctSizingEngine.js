// ProfessionalDuctSizingEngine.js
// HVAC AHU Duct Sizing Calculation Engine

export function calculateDuctSizing(input) {
  const {
    airFlowCFM,
    ductVelocity,
    aspectRatio,
    frictionRate,
    ductLength,
    fittingLossFactor,
  } = input;

  const errors = [];

  if (!airFlowCFM || airFlowCFM <= 0) {
    errors.push("Air flow must be greater than 0 CFM.");
  }

  if (!ductVelocity || ductVelocity <= 0) {
    errors.push("Duct velocity must be greater than 0 m/s.");
  }

  if (!aspectRatio || aspectRatio < 1) {
    errors.push("Aspect ratio must be minimum 1.");
  }

  if (!frictionRate || frictionRate <= 0) {
    errors.push("Friction rate must be greater than 0 Pa/m.");
  }

  if (!ductLength || ductLength <= 0) {
    errors.push("Duct length must be greater than 0 m.");
  }

  if (fittingLossFactor < 0) {
    errors.push("Fitting loss factor cannot be negative.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const cfmToM3s = 0.00047194745;

  const airFlowM3s = airFlowCFM * cfmToM3s;
  const ductAreaM2 = airFlowM3s / ductVelocity;

  // Rectangular duct sizing
  // aspectRatio = width / height
  const ductHeightM = Math.sqrt(ductAreaM2 / aspectRatio);
  const ductWidthM = ductHeightM * aspectRatio;

  const ductHeightMM = ductHeightM * 1000;
  const ductWidthMM = ductWidthM * 1000;

  const hydraulicDiameterM =
    (2 * ductWidthM * ductHeightM) / (ductWidthM + ductHeightM);

  const frictionPressureDrop = frictionRate * ductLength;
  const fittingPressureDrop = frictionPressureDrop * fittingLossFactor;
  const totalPressureDrop = frictionPressureDrop + fittingPressureDrop;

  return {
    airFlowM3s: round(airFlowM3s),
    ductVelocity: round(ductVelocity),
    ductAreaM2: round(ductAreaM2),
    ductWidthMM: round(ductWidthMM),
    ductHeightMM: round(ductHeightMM),
    hydraulicDiameterMM: round(hydraulicDiameterM * 1000),
    frictionPressureDrop: round(frictionPressureDrop),
    fittingPressureDrop: round(fittingPressureDrop),
    totalPressureDrop: round(totalPressureDrop),
    errors: [],
  };
}

function round(value) {
  return Number(value.toFixed(2));
}