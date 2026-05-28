export function runProfessionalCoilSelectionEngine(data) {
  const airFlowCFM = Number(data.airFlowCFM);

  const enteringDBT = Number(data.enteringDBT);
  const leavingDBT = Number(data.leavingDBT);

  const enteringWBT = Number(data.enteringWBT);
  const leavingWBT = Number(data.leavingWBT);

  const chilledWaterIn = Number(data.chilledWaterIn);
  const chilledWaterOut = Number(data.chilledWaterOut);

  const faceVelocity = Number(data.faceVelocity);

  const finSpacing = Number(data.finSpacing);
  const rows = Number(data.rows);

  // Airflow conversion
  const airFlowM3s =
    airFlowCFM * 0.000471947;

  // Air density
  const airDensity = 1.2;

  // Mass flow rate
  const airMassFlow =
    airFlowM3s * airDensity;

  // Sensible cooling
  const sensibleHeat =
    1.2 *
    airFlowM3s *
    (enteringDBT - leavingDBT) *
    1000;

  // Latent cooling approximation
  const latentHeat =
    0.68 *
    airFlowCFM *
    (enteringWBT - leavingWBT);

  // Total cooling
  const totalCooling =
    sensibleHeat + latentHeat;

  // Convert to TR
  const totalTR =
    totalCooling / 3517;

  // Water flow
  const waterDeltaT =
    chilledWaterOut - chilledWaterIn;

  const waterFlowLPM =
    totalCooling /
    (4.187 * waterDeltaT * 1000) *
    60000;

  // Coil face area
  const faceArea =
    airFlowM3s / faceVelocity;

  // Coil dimensions
  const coilHeight =
    Math.sqrt(faceArea / 1.5);

  const coilWidth =
    faceArea / coilHeight;

  // Apparatus dew point
  const adp =
    leavingDBT - 2;

  // Bypass factor
  const bypassFactor =
    (leavingDBT - adp) /
    (enteringDBT - adp);

  // Coil pressure drop
  const airPressureDrop =
    rows * 18 + finSpacing * 2;

  // Water pressure drop
  const waterPressureDrop =
    rows * 4;

  // Tube velocity
  const tubeVelocity =
    waterFlowLPM / 1000;

  // Coil efficiency
  const coilEfficiency =
    (1 - bypassFactor) * 100;

  // LMTD
  const delta1 =
    enteringDBT - chilledWaterOut;

  const delta2 =
    leavingDBT - chilledWaterIn;

  const lmtd =
    (delta1 - delta2) /
    Math.log(delta1 / delta2);

  return {
    airFlowM3s:
      airFlowM3s.toFixed(3),

    sensibleHeat:
      sensibleHeat.toFixed(2),

    latentHeat:
      latentHeat.toFixed(2),

    totalCooling:
      totalCooling.toFixed(2),

    totalTR:
      totalTR.toFixed(2),

    waterFlowLPM:
      waterFlowLPM.toFixed(2),

    faceArea:
      faceArea.toFixed(3),

    coilWidth:
      coilWidth.toFixed(3),

    coilHeight:
      coilHeight.toFixed(3),

    apparatusDewPoint:
      adp.toFixed(2),

    bypassFactor:
      bypassFactor.toFixed(3),

    airPressureDrop:
      airPressureDrop.toFixed(2),

    waterPressureDrop:
      waterPressureDrop.toFixed(2),

    tubeVelocity:
      tubeVelocity.toFixed(2),

    coilEfficiency:
      coilEfficiency.toFixed(2),

    lmtd:
      lmtd.toFixed(2),
  };
}