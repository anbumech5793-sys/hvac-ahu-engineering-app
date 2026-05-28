const ATM_PRESSURE_KPA = 101.325;
const AIR_DENSITY = 1.2;
const AIR_CP = 1.006;
const WATER_CP = 4.186;

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

/* =========================
PSYCHROMETRICS
========================= */

export function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.2694 * tempC) / (tempC + 237.3));
}

export function humidityRatio({
  dbtC = 25,
  rhPercent = 50,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  const pws = saturationPressureKPa(dbtC);
  const pv = (rhPercent / 100) * pws;
  return 0.62198 * pv / (pressureKPa - pv);
}

export function moistAirEnthalpy({
  dbtC = 25,
  humidityRatioKgKg = 0.01,
}) {
  return AIR_CP * dbtC + humidityRatioKgKg * (2501 + 1.86 * dbtC);
}

export function dewPointC({
  dbtC = 25,
  rhPercent = 50,
}) {
  const pws = saturationPressureKPa(dbtC);
  const pv = (rhPercent / 100) * pws;
  const ln = Math.log(pv / 0.61078);
  return (237.3 * ln) / (17.2694 - ln);
}

export function specificVolume({
  dbtC = 25,
  humidityRatioKgKg = 0.01,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  return (
    (0.287042 * (dbtC + 273.15) * (1 + 1.607858 * humidityRatioKgKg)) /
    pressureKPa
  );
}

export function psychrometricState({
  dbtC = 25,
  rhPercent = 50,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  const w = humidityRatio({ dbtC, rhPercent, pressureKPa });
  const h = moistAirEnthalpy({ dbtC, humidityRatioKgKg: w });
  const dp = dewPointC({ dbtC, rhPercent });
  const v = specificVolume({ dbtC, humidityRatioKgKg: w, pressureKPa });

  return {
    dbtC,
    rhPercent,
    pressureKPa,
    humidityRatioKgKg: Number(round(w, 5)),
    humidityRatioGPerKg: Number(round(w * 1000, 2)),
    enthalpyKJPerKg: Number(round(h, 2)),
    dewPointC: Number(round(dp, 2)),
    specificVolumeM3Kg: Number(round(v, 3)),
  };
}

/* =========================
HEAT LOAD ENGINE
========================= */

export function wallConductionLoad({
  areaM2 = 0,
  uValueWm2K = 1.5,
  outsideTempC = 35,
  insideTempC = 22,
}) {
  return num(areaM2) * num(uValueWm2K, 1.5) * (num(outsideTempC) - num(insideTempC));
}

export function glassSolarLoad({
  glassAreaM2 = 0,
  solarWm2 = 500,
  shadingCoefficient = 0.7,
}) {
  return num(glassAreaM2) * num(solarWm2, 500) * num(shadingCoefficient, 0.7);
}

export function peopleLoad({
  people = 1,
  sensibleWPerPerson = 75,
  latentWPerPerson = 55,
}) {
  const sensible = num(people, 1) * num(sensibleWPerPerson, 75);
  const latent = num(people, 1) * num(latentWPerPerson, 55);

  return {
    sensibleW: sensible,
    latentW: latent,
    totalW: sensible + latent,
  };
}

export function freshAirLoad({
  freshAirCMH = 0,
  outsideDBT = 35,
  outsideRH = 60,
  roomDBT = 22,
  roomRH = 50,
}) {
  const outside = psychrometricState({
    dbtC: outsideDBT,
    rhPercent: outsideRH,
  });

  const room = psychrometricState({
    dbtC: roomDBT,
    rhPercent: roomRH,
  });

  const massFlowKgS =
    (num(freshAirCMH) / 3600) / outside.specificVolumeM3Kg;

  const totalKW =
    massFlowKgS * (outside.enthalpyKJPerKg - room.enthalpyKJPerKg);

  const sensibleKW =
    massFlowKgS * AIR_CP * (outsideDBT - roomDBT);

  const latentKW =
    totalKW - sensibleKW;

  return {
    outside,
    room,
    massFlowKgS: Number(round(massFlowKgS, 3)),
    totalKW: Number(round(totalKW, 2)),
    sensibleKW: Number(round(sensibleKW, 2)),
    latentKW: Number(round(latentKW, 2)),
    totalTR: Number(round(totalKW / 3.517, 2)),
  };
}

export function calculateASHRAELoad({
  lengthM = 6,
  widthM = 5,
  heightM = 3,
  outsideDBT = 35,
  outsideRH = 60,
  insideDBT = 22,
  insideRH = 50,
  wallUValue = 1.5,
  roofUValue = 1.2,
  glassAreaM2 = 0,
  solarWm2 = 500,
  people = 4,
  lightingWm2 = 15,
  equipmentW = 3000,
  freshAirCMH = 450,
  safetyFactor = 1.1,
}) {
  const floorArea = num(lengthM) * num(widthM);
  const volume = floorArea * num(heightM);

  const wallArea =
    2 * (num(lengthM) + num(widthM)) * num(heightM);

  const roofArea = floorArea;

  const wallLoadW = wallConductionLoad({
    areaM2: wallArea,
    uValueWm2K: wallUValue,
    outsideTempC: outsideDBT,
    insideTempC: insideDBT,
  });

  const roofLoadW = wallConductionLoad({
    areaM2: roofArea,
    uValueWm2K: roofUValue,
    outsideTempC: outsideDBT,
    insideTempC: insideDBT,
  });

  const glassLoadW = glassSolarLoad({
    glassAreaM2,
    solarWm2,
    shadingCoefficient: 0.7,
  });

  const person = peopleLoad({ people });

  const lightingW = floorArea * num(lightingWm2, 15);

  const freshAir = freshAirLoad({
    freshAirCMH,
    outsideDBT,
    outsideRH,
    roomDBT: insideDBT,
    roomRH: insideRH,
  });

  const sensibleW =
    wallLoadW +
    roofLoadW +
    glassLoadW +
    person.sensibleW +
    lightingW +
    num(equipmentW) +
    freshAir.sensibleKW * 1000;

  const latentW =
    person.latentW +
    freshAir.latentKW * 1000;

  const totalW =
    (sensibleW + latentW) * num(safetyFactor, 1.1);

  return {
    room: {
      floorAreaM2: Number(round(floorArea, 2)),
      volumeM3: Number(round(volume, 2)),
      wallAreaM2: Number(round(wallArea, 2)),
      roofAreaM2: Number(round(roofArea, 2)),
    },
    loads: {
      wallLoadW: Number(round(wallLoadW, 0)),
      roofLoadW: Number(round(roofLoadW, 0)),
      glassSolarW: Number(round(glassLoadW, 0)),
      peopleSensibleW: Number(round(person.sensibleW, 0)),
      peopleLatentW: Number(round(person.latentW, 0)),
      lightingW: Number(round(lightingW, 0)),
      equipmentW: Number(round(equipmentW, 0)),
      freshAirSensibleW: Number(round(freshAir.sensibleKW * 1000, 0)),
      freshAirLatentW: Number(round(freshAir.latentKW * 1000, 0)),
      totalSensibleW: Number(round(sensibleW, 0)),
      totalLatentW: Number(round(latentW, 0)),
      grandTotalW: Number(round(totalW, 0)),
      grandTotalKW: Number(round(totalW / 1000, 2)),
      grandTotalTR: Number(round(totalW / 3517, 2)),
    },
    psychrometrics: {
      outside: freshAir.outside,
      room: freshAir.room,
      freshAir,
    },
  };
}

/* =========================
DUCT FRICTION ENGINE
========================= */

export function velocityPressurePa(velocityMS = 8) {
  return (AIR_DENSITY * Math.pow(num(velocityMS, 8), 2)) / 2;
}

export function darcyFrictionLossPa({
  lengthM = 10,
  hydraulicDiaM = 0.3,
  velocityMS = 8,
  frictionFactor = 0.02,
}) {
  const vp = velocityPressurePa(velocityMS);

  return (
    num(frictionFactor, 0.02) *
    (num(lengthM, 10) / num(hydraulicDiaM, 0.3)) *
    vp
  );
}

export function fittingPressureLossPa({
  kFactor = 1,
  velocityMS = 8,
}) {
  return num(kFactor, 1) * velocityPressurePa(velocityMS);
}

export function ductSizingASHRAE({
  airflowCMH = 2250,
  velocityMS = 8,
}) {
  const airflowM3S = num(airflowCMH) / 3600;
  const areaM2 = airflowM3S / num(velocityMS, 8);
  const roundDiaM = Math.sqrt((4 * areaM2) / Math.PI);

  return {
    airflowCMH: num(airflowCMH),
    velocityMS: num(velocityMS, 8),
    areaM2: Number(round(areaM2, 4)),
    roundDiaMM: Number(round(roundDiaM * 1000, 0)),
    velocityPressurePa: Number(round(velocityPressurePa(velocityMS), 2)),
  };
}

/* =========================
CLEANROOM RECOVERY
========================= */

export function cleanroomRecoveryTime({
  initialParticleCount = 3520000,
  finalParticleCount = 352000,
  ach = 25,
  mixingFactor = 1.0,
}) {
  const c0 = num(initialParticleCount);
  const ct = num(finalParticleCount);
  const n = num(ach, 25) * num(mixingFactor, 1);

  if (c0 <= 0 || ct <= 0 || ct >= c0 || n <= 0) {
    return {
      valid: false,
      recoveryMinutes: null,
      message: "Invalid recovery inputs.",
    };
  }

  const minutes = (-Math.log(ct / c0) / n) * 60;

  return {
    valid: true,
    initialParticleCount: c0,
    finalParticleCount: ct,
    ach: n,
    recoveryMinutes: Number(round(minutes, 2)),
  };
}

/* =========================
COIL ACCURACY HELPERS
========================= */

export function chilledWaterFlowLPM({
  loadKW = 10,
  waterDeltaTC = 5,
}) {
  const flowKgS = num(loadKW) / (WATER_CP * num(waterDeltaTC, 5));
  return Number(round(flowKgS * 60, 2));
}

export function coilFaceArea({
  airflowCMH = 2250,
  faceVelocityMS = 2.5,
}) {
  const area =
    (num(airflowCMH) / 3600) / num(faceVelocityMS, 2.5);

  return {
    faceAreaM2: Number(round(area, 3)),
    approximateWidthMM: Number(round(Math.sqrt(area) * 1000, 0)),
    approximateHeightMM: Number(round(Math.sqrt(area) * 750, 0)),
  };
}

/* =========================
MASTER ASHRAE CHECK
========================= */

export function runASHRAEMasterEngine(input = {}) {
  const load = calculateASHRAELoad(input);

  const duct = ductSizingASHRAE({
    airflowCMH: input.airflowCMH || input.freshAirCMH || 2250,
    velocityMS: input.ductVelocityMS || 8,
  });

  const recovery = cleanroomRecoveryTime({
    initialParticleCount: input.initialParticleCount || 3520000,
    finalParticleCount: input.finalParticleCount || 352000,
    ach: input.ach || 25,
  });

  const coil = {
    chwFlowLPM: chilledWaterFlowLPM({
      loadKW: load.loads.grandTotalKW,
      waterDeltaTC: input.waterDeltaTC || 5,
    }),
    face: coilFaceArea({
      airflowCMH: input.airflowCMH || 2250,
      faceVelocityMS: input.faceVelocityMS || 2.5,
    }),
  };

  const warnings = [];

  if (load.loads.grandTotalTR <= 0) {
    warnings.push("Cooling load is invalid. Check input values.");
  }

  if (duct.velocityMS > 9) {
    warnings.push("Duct velocity is high. Noise and pressure loss may increase.");
  }

  if (recovery.valid && recovery.recoveryMinutes > 20) {
    warnings.push("Cleanroom recovery time is high. Increase ACH or improve filtration strategy.");
  }

  return {
    load,
    duct,
    recovery,
    coil,
    warnings,
  };
}