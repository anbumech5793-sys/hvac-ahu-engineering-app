import {
  calculatePsychrometricProcess,
  getPsychrometricWarnings,
} from "./psychrometricMasterEngine";

import {
  runRecoveryMasterEngine,
} from "./recoveryMasterEngine";

const APPLICATION_DEFAULTS = {
  pharma_cleanroom: {
    name: "Pharma Cleanroom",
    cleanroomClass: "ISO 8",
    ach: 25,
    temperature: 22,
    rh: 50,
    pressure: 15,
    freshAirPercent: 20,
    exhaustPercent: 10,
    filterTrain: "G4 Pre Filter + F8 Fine Filter + H14 HEPA",
    ductVelocity: 8,
    faceVelocity: 2.5,
    fanEfficiency: 65,
    safetyFactor: 1.15,
    validation:
      "IQ / OQ / PQ, particle count, airflow balancing, pressure test, HEPA integrity test",
  },

  pharma_machine_ahu: {
    name: "Pharma Machine AHU",
    cleanroomClass: "Process AHU",
    ach: 20,
    temperature: 22,
    rh: 50,
    pressure: 10,
    freshAirPercent: 15,
    exhaustPercent: 10,
    filterTrain: "G4 + F8 + HEPA if required by process",
    ductVelocity: 8,
    faceVelocity: 2.5,
    fanEfficiency: 65,
    safetyFactor: 1.15,
    validation:
      "Machine airflow validation, temperature/RH mapping, pressure verification",
  },

  office_hvac: {
    name: "Office HVAC",
    cleanroomClass: "Comfort HVAC",
    ach: 6,
    temperature: 24,
    rh: 55,
    pressure: 0,
    freshAirPercent: 15,
    exhaustPercent: 5,
    filterTrain: "G4 Pre Filter + F7 Fine Filter",
    ductVelocity: 6,
    faceVelocity: 2.5,
    fanEfficiency: 60,
    safetyFactor: 1.1,
    validation: "Air balancing and comfort performance testing",
  },

  commercial_room: {
    name: "Commercial Room",
    cleanroomClass: "Comfort / Commercial HVAC",
    ach: 8,
    temperature: 24,
    rh: 55,
    pressure: 0,
    freshAirPercent: 15,
    exhaustPercent: 5,
    filterTrain: "G4 + F7",
    ductVelocity: 7,
    faceVelocity: 2.5,
    fanEfficiency: 60,
    safetyFactor: 1.1,
    validation: "Air balancing and commissioning required",
  },

  warehouse: {
    name: "Warehouse",
    cleanroomClass: "Controlled / Non-classified",
    ach: 8,
    temperature: 25,
    rh: 60,
    pressure: 0,
    freshAirPercent: 10,
    exhaustPercent: 5,
    filterTrain: "G4 + F7",
    ductVelocity: 8,
    faceVelocity: 2.5,
    fanEfficiency: 60,
    safetyFactor: 1.1,
    validation:
      "Ventilation verification and temperature mapping if storage critical",
  },

  hospital: {
    name: "Hospital HVAC",
    cleanroomClass: "Healthcare Controlled",
    ach: 15,
    temperature: 22,
    rh: 50,
    pressure: 10,
    freshAirPercent: 25,
    exhaustPercent: 10,
    filterTrain: "G4 + F8 + HEPA based on room criticality",
    ductVelocity: 7,
    faceVelocity: 2.5,
    fanEfficiency: 65,
    safetyFactor: 1.15,
    validation:
      "Air balancing, pressure verification, HEPA testing if applicable",
  },
};

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function getApplicationDefaults(application) {
  const key = String(application || "")
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_");

  if (APPLICATION_DEFAULTS[key]) return APPLICATION_DEFAULTS[key];
  if (key.includes("clean")) return APPLICATION_DEFAULTS.pharma_cleanroom;
  if (key.includes("machine") || key.includes("ahu"))
    return APPLICATION_DEFAULTS.pharma_machine_ahu;
  if (key.includes("office")) return APPLICATION_DEFAULTS.office_hvac;
  if (key.includes("commercial")) return APPLICATION_DEFAULTS.commercial_room;
  if (key.includes("warehouse") || key.includes("store"))
    return APPLICATION_DEFAULTS.warehouse;
  if (key.includes("hospital") || key.includes("ot") || key.includes("icu"))
    return APPLICATION_DEFAULTS.hospital;

  return APPLICATION_DEFAULTS.pharma_cleanroom;
}

function selectMotorHP(calculatedHP) {
  const standardHP = [
    0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50,
  ];

  return (
    standardHP.find((hp) => hp >= calculatedHP) ||
    standardHP[standardHP.length - 1]
  );
}

function selectCoilRows(deltaT) {
  if (deltaT <= 8) return 4;
  if (deltaT <= 14) return 6;
  return 8;
}

function estimateDiffuserQty(airflow) {
  return Math.max(1, Math.ceil(airflow / 600));
}

function estimateHEPAQty(airflow, applicationName) {
  if (!applicationName.toLowerCase().includes("pharma")) return 0;
  return Math.max(1, Math.ceil(airflow / 1000));
}

function createBOM(design) {
  const items = [
    {
      item: "AHU Casing",
      specification: `${design.ahu.length}L × ${design.ahu.width}W × ${design.ahu.height}H mm`,
      qty: 1,
      rate: design.airflow.supplyCMH * 12,
    },
    {
      item: "Filter Set",
      specification: design.designBasis.filterTrain,
      qty: 1,
      rate: 8500 + design.filters.hepaQty * 6500,
    },
    {
      item: "Cooling Coil",
      specification: `${design.coil.capacityTR.toFixed(2)} TR / ${design.coil.rows} Row`,
      qty: 1,
      rate: design.coil.capacityTR * 18000,
    },
    {
      item: "Fan & Motor",
      specification: `${design.fan.motorHP} HP / ${design.pressure.totalStaticPa.toFixed(0)} Pa`,
      qty: 1,
      rate: design.fan.motorHP * 12000,
    },
    {
      item: "Ducting",
      specification: `${design.duct.mainDuctDiaMM.toFixed(0)} mm equivalent duct`,
      qty: 1,
      rate: design.airflow.supplyCMH * 8,
    },
    {
      item: "Diffusers / Grilles",
      specification: `${design.duct.diffuserQty} supply diffusers`,
      qty: design.duct.diffuserQty,
      rate: design.duct.diffuserQty * 2500,
    },
  ];

  const material = items.reduce((sum, item) => sum + item.rate, 0);
  const fabrication = material * 0.18;
  const installation = material * 0.15;
  const overhead = material * 0.12;
  const profit = (material + fabrication + installation + overhead) * 0.25;
  const selling = material + fabrication + installation + overhead + profit;

  return {
    items,
    material: Number(round(material, 0)),
    fabrication: Number(round(fabrication, 0)),
    installation: Number(round(installation, 0)),
    overhead: Number(round(overhead, 0)),
    profit: Number(round(profit, 0)),
    selling: Number(round(selling, 0)),
  };
}

export function runAutoDesignEngine(input = {}) {
  const defaults = getApplicationDefaults(input.application);

  const designBasis = {
    application: defaults.name,
    cleanroomClass: input.cleanroomClass || defaults.cleanroomClass,
    ach: num(input.ach, defaults.ach),
    temperature: num(input.temperature, defaults.temperature),
    rh: num(input.rh, defaults.rh),
    pressure: num(input.pressure, defaults.pressure),
    freshAirPercent: num(input.freshAirPercent, defaults.freshAirPercent),
    exhaustPercent: num(input.exhaustPercent, defaults.exhaustPercent),
    filterTrain: input.filterTrain || defaults.filterTrain,
    ductVelocity: num(input.ductVelocity, defaults.ductVelocity),
    faceVelocity: num(input.faceVelocity, defaults.faceVelocity),
    fanEfficiency: num(input.fanEfficiency, defaults.fanEfficiency),
    safetyFactor: num(input.safetyFactor, defaults.safetyFactor),
    validation: defaults.validation,
    standards: [
      "ISO 14644-1 cleanroom classification where applicable",
      "ISO 14644-3 cleanroom testing where applicable",
      "EU GMP Annex 1 for sterile pharma applications where applicable",
      "ASHRAE HVAC engineering reference",
      "SMACNA duct construction reference",
      "AMCA fan performance reference",
      "EN 1822 / ISO 29463 / ISO 16890 filter reference",
    ],
  };

  const room = {
    length: num(input.length),
    width: num(input.width),
    height: num(input.height),
  };

  room.area = room.length * room.width;
  room.volume = room.length * room.width * room.height;

  const airflow = {
    supplyCMH: room.volume * designBasis.ach,
  };

  airflow.supplyCMH *= designBasis.safetyFactor;
  airflow.freshAirCMH =
    airflow.supplyCMH * (designBasis.freshAirPercent / 100);
  airflow.exhaustCMH =
    airflow.supplyCMH * (designBasis.exhaustPercent / 100);
  airflow.returnAirCMH =
    airflow.supplyCMH - airflow.freshAirCMH - airflow.exhaustCMH;

  const people = num(input.people, Math.max(1, Math.round(room.area / 12)));
  const equipmentLoadW = num(input.equipmentLoadW, room.area * 50);
  const lightingLoadW = num(input.lightingLoadW, room.area * 15);
  const peopleLoadW = people * 150;

  const load = {
    people,
    peopleLoadW,
    lightingLoadW,
    equipmentLoadW,
  };

  load.totalSensibleW = peopleLoadW + lightingLoadW + equipmentLoadW;
  load.totalTR = load.totalSensibleW / 3517;

  const enteringTemp = num(input.enteringTemp, 35);
  const leavingTemp = num(input.leavingTemp, designBasis.temperature - 8);
  const deltaT = Math.max(1, enteringTemp - leavingTemp);

  const psychrometrics = calculatePsychrometricProcess({
    outsideDBT: num(input.outsideDBT, enteringTemp),
    outsideRH: num(input.outsideRH, 60),
    roomDBT: designBasis.temperature,
    roomRH: designBasis.rh,
    supplyDBT: leavingTemp,
    supplyRH: num(input.supplyRH, 90),
    airflowCMH: airflow.supplyCMH,
  });

  const psychrometricWarnings =
    getPsychrometricWarnings(psychrometrics);

  const coil = {
    enteringTemp,
    leavingTemp,
    deltaT,
    loadKW: psychrometrics.totalCoolingKW,
    sensibleKW: psychrometrics.sensibleCoolingKW,
    latentKW: psychrometrics.latentCoolingKW,
    moistureRemovalKgHr: psychrometrics.moistureRemovalKgHr,
    capacityTR: psychrometrics.totalCoolingTR * designBasis.safetyFactor,
    rows: selectCoilRows(deltaT),
    chwFlowLPM:
      psychrometrics.totalCoolingTR * designBasis.safetyFactor * 2.4,
    faceAreaM2:
      airflow.supplyCMH / (3600 * designBasis.faceVelocity),
  };

  const pressure = {
    preFilterPa: num(input.preFilterPa, 80),
    fineFilterPa: num(input.fineFilterPa, 120),
    hepaPa: designBasis.filterTrain.toLowerCase().includes("hepa")
      ? num(input.hepaPa, 180)
      : 0,
    coilPa: num(input.coilPa, 150),
    ductPa: num(input.ductPa, 250),
    terminalPa: num(input.terminalPa, 80),
    marginPa: num(input.marginPa, 100),
  };

  pressure.totalStaticPa =
    pressure.preFilterPa +
    pressure.fineFilterPa +
    pressure.hepaPa +
    pressure.coilPa +
    pressure.ductPa +
    pressure.terminalPa +
    pressure.marginPa;

  const fan = {};

  fan.powerKW =
    ((airflow.supplyCMH / 3600) * pressure.totalStaticPa) /
    (1000 * (designBasis.fanEfficiency / 100));

  fan.calculatedHP = fan.powerKW / 0.746;
  fan.motorHP = selectMotorHP(fan.calculatedHP);

  const ductArea =
    airflow.supplyCMH / (3600 * designBasis.ductVelocity);

  const duct = {
    velocity: designBasis.ductVelocity,
    areaM2: ductArea,
    mainDuctDiaMM: Math.sqrt((4 * ductArea) / Math.PI) * 1000,
    diffuserQty: estimateDiffuserQty(airflow.supplyCMH),
    diffuserAirflowCMH:
      airflow.supplyCMH / estimateDiffuserQty(airflow.supplyCMH),
  };

  const filters = {
    filterTrain: designBasis.filterTrain,
    hepaQty: estimateHEPAQty(airflow.supplyCMH, designBasis.application),
    preFilterSize: "610 × 610 × 50 mm preliminary",
    fineFilterSize: "610 × 610 × 150 mm preliminary",
    hepaSize: "610 × 610 × 150 mm preliminary",
  };

  const ahu = {
    faceAreaM2: coil.faceAreaM2,
    width: Math.ceil(Math.sqrt(coil.faceAreaM2) * 1000),
    height: Math.ceil(Math.sqrt(coil.faceAreaM2) * 750),
    length: 2800 + filters.hepaQty * 250,
    sections: [
      "Mixing / Fresh Air Section",
      "Pre Filter Section",
      "Fine Filter Section",
      "Cooling Coil Section",
      "Fan Section",
      "HEPA / Terminal Filter Section if applicable",
    ],
  };

  const pressureCascade = [
    {
      area: "Adjacent / Corridor",
      pressurePa: Math.max(0, designBasis.pressure - 10),
    },
    {
      area: "Airlock",
      pressurePa: Math.max(0, designBasis.pressure - 5),
    },
    {
      area: designBasis.application,
      pressurePa: designBasis.pressure,
    },
  ];

  const recovery = runRecoveryMasterEngine({
    isoClass: designBasis.cleanroomClass,
    ach: designBasis.ach,
    currentParticleCount: input.currentParticleCount,
    measuredParticleCount: input.measuredParticleCount,
  });

  const design = {
    input,
    designBasis,
    room,
    airflow,
    load,
    psychrometrics,
    recovery,
    coil,
    pressure,
    fan,
    duct,
    filters,
    ahu,
    pressureCascade,
  };

  design.bom = createBOM(design);

  design.warnings = [
    ...psychrometricWarnings,
    ...recovery.warnings,
  ];

  if (!room.length || !room.width || !room.height) {
    design.warnings.push(
      "Room size is incomplete. Enter length, width and height."
    );
  }

  if (airflow.returnAirCMH < 0) {
    design.warnings.push(
      "Fresh air + exhaust is higher than supply airflow. Check air balance."
    );
  }

  if (coil.capacityTR <= 0) {
    design.warnings.push(
      "Coil capacity is not valid. Check entering and leaving air temperatures."
    );
  }

  if (
    designBasis.application.includes("Pharma") ||
    designBasis.cleanroomClass.includes("ISO")
  ) {
    design.warnings.push(
      "Cleanroom design must be validated by ISO 14644 testing, airflow balancing, HEPA integrity test, and site qualification."
    );
  }

  return design;
}