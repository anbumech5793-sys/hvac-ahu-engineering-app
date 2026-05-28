export function runProfessionalDuctSizingEngine(data) {
  const airFlowCFM = Number(data.airFlowCFM);

  const velocity = Number(data.velocity);

  const ductLength = Number(data.ductLength);

  const roughness = Number(data.roughness);

  const airDensity = 1.2;

  // Convert airflow
  const airFlowM3s =
    airFlowCFM * 0.000471947;

  // Required duct area
  const ductArea =
    airFlowM3s / velocity;

  // Rectangular duct sizing
  const aspectRatio = 2;

  const ductHeight =
    Math.sqrt(ductArea / aspectRatio);

  const ductWidth =
    ductArea / ductHeight;

  // Convert to mm
  const ductWidthMM =
    ductWidth * 1000;

  const ductHeightMM =
    ductHeight * 1000;

  // Equivalent diameter
  const equivalentDiameter =
    1.3 *
    Math.pow(
      (ductWidthMM * ductHeightMM),
      0.625
    ) /
    Math.pow(
      (ductWidthMM + ductHeightMM),
      0.25
    );

  // Velocity pressure
  const velocityPressure =
    0.6 * Math.pow(velocity, 2);

  // Hydraulic diameter
  const hydraulicDiameter =
    (2 *
      ductWidth *
      ductHeight) /
    (ductWidth + ductHeight);

  // Reynolds number
  const kinematicViscosity =
    1.5e-5;

  const reynoldsNumber =
    (velocity *
      hydraulicDiameter) /
    kinematicViscosity;

  // Friction factor
  let frictionFactor = 0.02;

  if (reynoldsNumber < 4000)
    frictionFactor = 0.03;

  // Friction loss
  const frictionLoss =
    frictionFactor *
    (ductLength /
      hydraulicDiameter) *
    velocityPressure;

  // Dynamic pressure
  const dynamicPressure =
    0.5 *
    airDensity *
    Math.pow(velocity, 2);

  // Equal friction
  const equalFriction =
    frictionLoss / ductLength;

  // Noise check
  let noiseLevel = "Low";

  if (velocity > 8)
    noiseLevel = "Medium";

  if (velocity > 12)
    noiseLevel = "High";

  // Static regain approximation
  const staticRegain =
    dynamicPressure * 0.75;

  // Round duct diameter
  const roundDiameter =
    Math.sqrt(
      (4 * ductArea) / Math.PI
    ) * 1000;

  return {
    airFlowM3s:
      airFlowM3s.toFixed(3),

    ductArea:
      ductArea.toFixed(3),

    ductWidthMM:
      ductWidthMM.toFixed(0),

    ductHeightMM:
      ductHeightMM.toFixed(0),

    equivalentDiameter:
      equivalentDiameter.toFixed(2),

    hydraulicDiameter:
      (hydraulicDiameter * 1000).toFixed(2),

    velocityPressure:
      velocityPressure.toFixed(2),

    reynoldsNumber:
      reynoldsNumber.toFixed(0),

    frictionFactor:
      frictionFactor.toFixed(4),

    frictionLoss:
      frictionLoss.toFixed(2),

    equalFriction:
      equalFriction.toFixed(3),

    dynamicPressure:
      dynamicPressure.toFixed(2),

    staticRegain:
      staticRegain.toFixed(2),

    roundDiameter:
      roundDiameter.toFixed(0),

    noiseLevel,
  };
}