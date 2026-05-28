const AIR_CP_KJ_KG_K = 1.006;
const WATER_VAPOR_LATENT_KJ_KG = 2501;
const ATM_PRESSURE_KPA = 101.325;

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

/* ================= PSYCHROMETRIC HELPERS ================= */

function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

function humidityRatioKgKg({ dbtC = 25, rhPercent = 50 }) {
  const pws = saturationPressureKPa(dbtC);
  const pv = (rhPercent / 100) * pws;
  return 0.62198 * pv / (ATM_PRESSURE_KPA - pv);
}

function enthalpyKJkg({ dbtC = 25, rhPercent = 50 }) {
  const w = humidityRatioKgKg({ dbtC, rhPercent });
  return AIR_CP_KJ_KG_K * dbtC + w * (WATER_VAPOR_LATENT_KJ_KG + 1.86 * dbtC);
}

function specificVolumeM3kg({ dbtC = 25, rhPercent = 50 }) {
  const w = humidityRatioKgKg({ dbtC, rhPercent });
  return (
    (0.287042 * (dbtC + 273.15) * (1 + 1.607858 * w)) /
    ATM_PRESSURE_KPA
  );
}

/* ================= LOAD COMPONENTS ================= */

export function calculateEnvelopeLoad({
  length = 0,
  width = 0,
  height = 0,
  outsideDBT = 35,
  insideDBT = 22,
  wallUValue = 1.5,
  roofUValue = 1.2,
  floorUValue = 0,
}) {
  const l = num(length);
  const w = num(width);
  const h = num(height);

  const deltaT = num(outsideDBT) - num(insideDBT);

  const wallAreaM2 = 2 * (l + w) * h;
  const roofAreaM2 = l * w;
  const floorAreaM2 = l * w;

  const wallLoadW = wallAreaM2 * num(wallUValue, 1.5) * deltaT;
  const roofLoadW = roofAreaM2 * num(roofUValue, 1.2) * deltaT;
  const floorLoadW = floorAreaM2 * num(floorUValue, 0) * deltaT;

  return {
    wallAreaM2: Number(round(wallAreaM2, 2)),
    roofAreaM2: Number(round(roofAreaM2, 2)),
    floorAreaM2: Number(round(floorAreaM2, 2)),
    deltaT: Number(round(deltaT, 2)),
    wallLoadW: Number(round(wallLoadW, 0)),
    roofLoadW: Number(round(roofLoadW, 0)),
    floorLoadW: Number(round(floorLoadW, 0)),
    totalEnvelopeLoadW: Number(round(wallLoadW + roofLoadW + floorLoadW, 0)),
  };
}

export function calculateSolarGlassLoad({
  glassAreaM2 = 0,
  solarRadiationWm2 = 500,
  shadingCoefficient = 0.7,
  glassFactor = 1,
}) {
  const loadW =
    num(glassAreaM2) *
    num(solarRadiationWm2, 500) *
    num(shadingCoefficient, 0.7) *
    num(glassFactor, 1);

  return {
    glassAreaM2: num(glassAreaM2),
    solarRadiationWm2: num(solarRadiationWm2, 500),
    shadingCoefficient: num(shadingCoefficient, 0.7),
    glassFactor: num(glassFactor, 1),
    solarGlassLoadW: Number(round(loadW, 0)),
  };
}

export function calculatePeopleLoad({
  people = 1,
  sensibleWPerPerson = 75,
  latentWPerPerson = 55,
}) {
  const sensibleW = num(people, 1) * num(sensibleWPerPerson, 75);
  const latentW = num(people, 1) * num(latentWPerPerson, 55);

  return {
    people: num(people, 1),
    sensibleWPerPerson: num(sensibleWPerPerson, 75),
    latentWPerPerson: num(latentWPerPerson, 55),
    peopleSensibleW: Number(round(sensibleW, 0)),
    peopleLatentW: Number(round(latentW, 0)),
    peopleTotalW: Number(round(sensibleW + latentW, 0)),
  };
}

export function calculateLightingLoad({
  areaM2 = 0,
  lightingWm2 = 15,
}) {
  const lightingLoadW = num(areaM2) * num(lightingWm2, 15);

  return {
    areaM2: num(areaM2),
    lightingWm2: num(lightingWm2, 15),
    lightingLoadW: Number(round(lightingLoadW, 0)),
  };
}

export function calculateEquipmentLoad({
  equipmentLoadW = 0,
  diversityFactor = 1,
}) {
  const loadW = num(equipmentLoadW) * num(diversityFactor, 1);

  return {
    equipmentLoadW: num(equipmentLoadW),
    diversityFactor: num(diversityFactor, 1),
    effectiveEquipmentLoadW: Number(round(loadW, 0)),
  };
}

export function calculateFreshAirLoad({
  freshAirCMH = 0,
  outsideDBT = 35,
  outsideRH = 60,
  insideDBT = 22,
  insideRH = 50,
}) {
  const outsideH = enthalpyKJkg({
    dbtC: outsideDBT,
    rhPercent: outsideRH,
  });

  const insideH = enthalpyKJkg({
    dbtC: insideDBT,
    rhPercent: insideRH,
  });

  const outsideW = humidityRatioKgKg({
    dbtC: outsideDBT,
    rhPercent: outsideRH,
  });

  const insideW = humidityRatioKgKg({
    dbtC: insideDBT,
    rhPercent: insideRH,
  });

  const specificVolume = specificVolumeM3kg({
    dbtC: outsideDBT,
    rhPercent: outsideRH,
  });

  const massFlowKgS = (num(freshAirCMH) / 3600) / specificVolume;

  const totalKW = massFlowKgS * (outsideH - insideH);
  const sensibleKW = massFlowKgS * AIR_CP_KJ_KG_K * (num(outsideDBT) - num(insideDBT));
  const latentKW = totalKW - sensibleKW;

  const moistureKgHr = massFlowKgS * (outsideW - insideW) * 3600;

  return {
    freshAirCMH: num(freshAirCMH),
    outsideDBT: num(outsideDBT),
    outsideRH: num(outsideRH),
    insideDBT: num(insideDBT),
    insideRH: num(insideRH),
    outsideHumidityRatioGkg: Number(round(outsideW * 1000, 2)),
    insideHumidityRatioGkg: Number(round(insideW * 1000, 2)),
    outsideEnthalpyKJkg: Number(round(outsideH, 2)),
    insideEnthalpyKJkg: Number(round(insideH, 2)),
    massFlowKgS: Number(round(massFlowKgS, 3)),
    freshAirTotalKW: Number(round(totalKW, 2)),
    freshAirSensibleKW: Number(round(sensibleKW, 2)),
    freshAirLatentKW: Number(round(latentKW, 2)),
    moistureLoadKgHr: Number(round(moistureKgHr, 2)),
    freshAirTotalW: Number(round(totalKW * 1000, 0)),
    freshAirSensibleW: Number(round(sensibleKW * 1000, 0)),
    freshAirLatentW: Number(round(latentKW * 1000, 0)),
  };
}

/* ================= MASTER PROFESSIONAL HEAT LOAD ================= */

export function runProfessionalHeatLoadEngine(input = {}) {
  const length = num(input.length);
  const width = num(input.width);
  const height = num(input.height);

  const areaM2 = length * width;
  const volumeM3 = areaM2 * height;

  const outsideDBT = num(input.outsideDBT, 35);
  const outsideRH = num(input.outsideRH, 60);
  const insideDBT = num(input.temperature, 22);
  const insideRH = num(input.rh, 50);

  const envelope = calculateEnvelopeLoad({
    length,
    width,
    height,
    outsideDBT,
    insideDBT,
    wallUValue: num(input.wallUValue, 1.5),
    roofUValue: num(input.roofUValue, 1.2),
    floorUValue: num(input.floorUValue, 0),
  });

  const solar = calculateSolarGlassLoad({
    glassAreaM2: num(input.glassAreaM2, 0),
    solarRadiationWm2: num(input.solarRadiationWm2, 500),
    shadingCoefficient: num(input.shadingCoefficient, 0.7),
    glassFactor: num(input.glassFactor, 1),
  });

  const people = calculatePeopleLoad({
    people: num(input.people, Math.max(1, Math.round(areaM2 / 12))),
    sensibleWPerPerson: num(input.sensibleWPerPerson, 75),
    latentWPerPerson: num(input.latentWPerPerson, 55),
  });

  const lighting = calculateLightingLoad({
    areaM2,
    lightingWm2: num(input.lightingWm2, 15),
  });

  const equipment = calculateEquipmentLoad({
    equipmentLoadW: num(input.equipmentLoadW, areaM2 * 50),
    diversityFactor: num(input.equipmentDiversityFactor, 1),
  });

  const freshAir = calculateFreshAirLoad({
    freshAirCMH: num(input.freshAirCMH, 0),
    outsideDBT,
    outsideRH,
    insideDBT,
    insideRH,
  });

  const sensibleW =
    envelope.totalEnvelopeLoadW +
    solar.solarGlassLoadW +
    people.peopleSensibleW +
    lighting.lightingLoadW +
    equipment.effectiveEquipmentLoadW +
    freshAir.freshAirSensibleW;

  const latentW =
    people.peopleLatentW +
    freshAir.freshAirLatentW;

  const subtotalW = sensibleW + latentW;
  const safetyFactor = num(input.safetyFactor, 1.1);
  const totalW = subtotalW * safetyFactor;

  const warnings = [];

  if (!length || !width || !height) {
    warnings.push("Room size is incomplete. Heat load may be invalid.");
  }

  if (freshAir.freshAirLatentKW < 0) {
    warnings.push("Fresh air latent load is negative. Check outside/inside RH conditions.");
  }

  if (totalW <= 0) {
    warnings.push("Total heat load is invalid. Check input values.");
  }

  if (outsideDBT < insideDBT) {
    warnings.push("Outside temperature is lower than room temperature. Cooling load may reduce or heating may be required.");
  }

  return {
    room: {
      length,
      width,
      height,
      areaM2: Number(round(areaM2, 2)),
      volumeM3: Number(round(volumeM3, 2)),
    },

    conditions: {
      outsideDBT,
      outsideRH,
      insideDBT,
      insideRH,
    },

    components: {
      envelope,
      solar,
      people,
      lighting,
      equipment,
      freshAir,
    },

    summary: {
      sensibleW: Number(round(sensibleW, 0)),
      latentW: Number(round(latentW, 0)),
      subtotalW: Number(round(subtotalW, 0)),
      safetyFactor,
      totalW: Number(round(totalW, 0)),
      totalKW: Number(round(totalW / 1000, 2)),
      totalTR: Number(round(totalW / 3517, 2)),
      sensibleHeatRatio: subtotalW > 0 ? Number(round(sensibleW / subtotalW, 2)) : 0,
    },

    chartData: [
      { load: "Envelope", value: envelope.totalEnvelopeLoadW },
      { load: "Solar", value: solar.solarGlassLoadW },
      { load: "People Sensible", value: people.peopleSensibleW },
      { load: "People Latent", value: people.peopleLatentW },
      { load: "Lighting", value: lighting.lightingLoadW },
      { load: "Equipment", value: equipment.effectiveEquipmentLoadW },
      { load: "Fresh Air Sensible", value: freshAir.freshAirSensibleW },
      { load: "Fresh Air Latent", value: freshAir.freshAirLatentW },
    ],

    warnings,
  };
}