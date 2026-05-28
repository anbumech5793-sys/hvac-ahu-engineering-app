export function calculateCoilSelection(input) {
  const {
    airFlowCFM,
    enteringDBT,
    enteringRH,
    leavingDBT,
    leavingRH,
    chilledWaterInTemp,
    chilledWaterOutTemp,
  } = input;

  const errors = [];

  if (!airFlowCFM || airFlowCFM <= 0) {
    errors.push("Air flow must be greater than 0 CFM.");
  }

  if (enteringDBT <= leavingDBT) {
    errors.push("Entering DBT must be higher than leaving DBT for cooling coil.");
  }

  if (chilledWaterOutTemp <= chilledWaterInTemp) {
    errors.push("Chilled water outlet temperature must be higher than inlet temperature.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  // Constants
  const airDensity = 1.2; // kg/m³
  const cpAir = 1.005; // kJ/kg.K
  const cpWater = 4.186; // kJ/kg.K
  const cfmToM3s = 0.00047194745;

  // Air flow conversion
  const airFlowM3s = airFlowCFM * cfmToM3s;

  // Air mass flow
  const airMassFlow = airFlowM3s * airDensity;

  // Simple sensible cooling load
  const deltaTair = enteringDBT - leavingDBT;
  const sensibleLoadKW = airMassFlow * cpAir * deltaTair;

  // Approximate latent load factor using RH difference
  const rhDifference = Math.max(enteringRH - leavingRH, 0);
  const latentLoadKW = sensibleLoadKW * (rhDifference / 100) * 0.45;

  // Total coil load
  const totalLoadKW = sensibleLoadKW + latentLoadKW;

  // TR conversion
  const totalLoadTR = totalLoadKW / 3.517;

  // Chilled water flow
  const deltaTwater = chilledWaterOutTemp - chilledWaterInTemp;
  const waterFlowKgS = totalLoadKW / (cpWater * deltaTwater);

  // Convert kg/s to LPM
  const waterFlowLPM = waterFlowKgS * 60;

  // Approximate coil face area
  const recommendedFaceVelocity = 2.5; // m/s
  const coilFaceArea = airFlowM3s / recommendedFaceVelocity;

  return {
    airFlowM3s: round(airFlowM3s),
    airMassFlow: round(airMassFlow),
    sensibleLoadKW: round(sensibleLoadKW),
    latentLoadKW: round(latentLoadKW),
    totalLoadKW: round(totalLoadKW),
    totalLoadTR: round(totalLoadTR),
    chilledWaterFlowKgS: round(waterFlowKgS),
    chilledWaterFlowLPM: round(waterFlowLPM),
    coilFaceArea: round(coilFaceArea),
    recommendedFaceVelocity,
    deltaTair: round(deltaTair),
    deltaTwater: round(deltaTwater),
    errors: [],
  };
}

function round(value) {
  return Number(value.toFixed(2));
}