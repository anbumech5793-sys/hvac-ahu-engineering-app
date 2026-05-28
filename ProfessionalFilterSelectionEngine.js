// ProfessionalFilterSelectionEngine.js
// HVAC AHU Filter Selection Calculation Engine

export function calculateFilterSelection(input) {
  const {
    airFlowCFM,
    filterFaceVelocity,
    initialPressureDrop,
    finalPressureDrop,
    filterEfficiency,
  } = input;

  const errors = [];

  if (!airFlowCFM || airFlowCFM <= 0) {
    errors.push("Air flow must be greater than 0 CFM.");
  }

  if (!filterFaceVelocity || filterFaceVelocity <= 0) {
    errors.push("Filter face velocity must be greater than 0 m/s.");
  }

  if (!initialPressureDrop || initialPressureDrop <= 0) {
    errors.push("Initial pressure drop must be greater than 0 Pa.");
  }

  if (!finalPressureDrop || finalPressureDrop <= initialPressureDrop) {
    errors.push("Final pressure drop must be greater than initial pressure drop.");
  }

  if (!filterEfficiency || filterEfficiency <= 0 || filterEfficiency > 100) {
    errors.push("Filter efficiency must be between 1 and 100%.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const cfmToM3s = 0.00047194745;
  const m2ToFt2 = 10.7639;

  const airFlowM3s = airFlowCFM * cfmToM3s;
  const requiredFilterAreaM2 = airFlowM3s / filterFaceVelocity;
  const requiredFilterAreaFt2 = requiredFilterAreaM2 * m2ToFt2;

  const averagePressureDrop = (initialPressureDrop + finalPressureDrop) / 2;

  const recommendedStaticPressureAllowance = finalPressureDrop;

  return {
    airFlowM3s: round(airFlowM3s),
    requiredFilterAreaM2: round(requiredFilterAreaM2),
    requiredFilterAreaFt2: round(requiredFilterAreaFt2),
    averagePressureDrop: round(averagePressureDrop),
    recommendedStaticPressureAllowance: round(recommendedStaticPressureAllowance),
    filterEfficiency: round(filterEfficiency),
    errors: [],
  };
}

function round(value) {
  return Number(value.toFixed(2));
}