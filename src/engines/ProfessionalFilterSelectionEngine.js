export function runProfessionalFilterSelectionEngine(data) {
  const airFlowCFM = Number(data.airFlowCFM);

  const faceVelocity = Number(data.faceVelocity);

  const filterWidth = Number(data.filterWidth);
  const filterHeight = Number(data.filterHeight);

  const initialResistance = Number(data.initialResistance);

  const dustConcentration = Number(data.dustConcentration);

  const operatingHours = Number(data.operatingHours);

  const filterEfficiency = Number(data.filterEfficiency);

  const mervRating = Number(data.mervRating);

  // Convert airflow
  const airFlowM3s =
    airFlowCFM * 0.000471947;

  // Filter area
  const filterArea =
    (filterWidth * filterHeight) / 1000000;

  // Actual face velocity
  const actualFaceVelocity =
    airFlowM3s / filterArea;

  // Final resistance
  const finalResistance =
    initialResistance * 2.5;

  // Pressure drop growth
  const pressureGrowth =
    finalResistance - initialResistance;

  // Dust loading
  const dustLoading =
    airFlowM3s *
    dustConcentration *
    operatingHours;

  // Dust holding capacity
  const dustHoldingCapacity =
    dustLoading * 0.8;

  // Filter life estimation
  const filterLifeDays =
    dustHoldingCapacity /
    (dustConcentration * 24);

  // Energy impact
  const energyImpact =
    (finalResistance / 1000) *
    airFlowM3s *
    operatingHours;

  // HEPA logic
  let filterType = "Pre Filter";

  if (filterEfficiency >= 85)
    filterType = "Fine Filter";

  if (filterEfficiency >= 99.97)
    filterType = "HEPA Filter";

  // Cleanroom suitability
  let cleanroomClass =
    "General HVAC";

  if (filterEfficiency >= 95)
    cleanroomClass =
      "Pharmaceutical Cleanroom";

  if (filterEfficiency >= 99.97)
    cleanroomClass =
      "ISO Cleanroom";

  // Face velocity validation
  let velocityStatus = "Acceptable";

  if (actualFaceVelocity > 2.5)
    velocityStatus = "High Velocity";

  if (actualFaceVelocity < 1.5)
    velocityStatus = "Low Velocity";

  return {
    airFlowM3s:
      airFlowM3s.toFixed(3),

    filterArea:
      filterArea.toFixed(3),

    actualFaceVelocity:
      actualFaceVelocity.toFixed(2),

    initialResistance:
      initialResistance.toFixed(2),

    finalResistance:
      finalResistance.toFixed(2),

    pressureGrowth:
      pressureGrowth.toFixed(2),

    dustLoading:
      dustLoading.toFixed(2),

    dustHoldingCapacity:
      dustHoldingCapacity.toFixed(2),

    filterLifeDays:
      filterLifeDays.toFixed(0),

    energyImpact:
      energyImpact.toFixed(2),

    filterType,

    cleanroomClass,

    velocityStatus,

    mervRating,
  };
}