function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function frictionLossPaPerMeter(velocityMS) {
  const v = num(velocityMS, 8);

  if (v <= 4) return 0.6;
  if (v <= 6) return 0.9;
  if (v <= 8) return 1.3;
  if (v <= 10) return 1.8;
  return 2.5;
}

function fittingLoss({
  velocityMS = 8,
  lossCoefficient = 1,
}) {
  const airDensity = 1.2;
  const v = num(velocityMS, 8);
  const k = num(lossCoefficient, 1);

  return k * (airDensity * v * v) / 2;
}

export function calculatePressureLoss({
  airflowCMH = 0,
  velocityMS = 8,
  straightLengthM = 15,
  elbows = 3,
  reducers = 1,
  tees = 1,
  dampers = 1,
  preFilterPa = 80,
  fineFilterPa = 120,
  coilPa = 150,
  hepaPa = 180,
  diffuserPa = 35,
  terminalPa = 50,
  safetyMarginPa = 100,
}) {
  const velocity = num(velocityMS, 8);

  const straightDuctLoss =
    frictionLossPaPerMeter(velocity) *
    num(straightLengthM, 15);

  const elbowLoss =
    num(elbows, 0) *
    fittingLoss({
      velocityMS: velocity,
      lossCoefficient: 0.75,
    });

  const reducerLoss =
    num(reducers, 0) *
    fittingLoss({
      velocityMS: velocity,
      lossCoefficient: 0.35,
    });

  const teeLoss =
    num(tees, 0) *
    fittingLoss({
      velocityMS: velocity,
      lossCoefficient: 1.2,
    });

  const damperLoss =
    num(dampers, 0) *
    fittingLoss({
      velocityMS: velocity,
      lossCoefficient: 1.5,
    });

  const equipmentLoss =
    num(preFilterPa, 0) +
    num(fineFilterPa, 0) +
    num(coilPa, 0) +
    num(hepaPa, 0) +
    num(diffuserPa, 0) +
    num(terminalPa, 0);

  const fittingTotal =
    elbowLoss +
    reducerLoss +
    teeLoss +
    damperLoss;

  const ductTotal =
    straightDuctLoss +
    fittingTotal;

  const totalStaticPressure =
    ductTotal +
    equipmentLoss +
    num(safetyMarginPa, 100);

  const recommendedFanPressure =
    Math.ceil(totalStaticPressure / 50) * 50;

  const warnings = [];

  if (velocity > 9) {
    warnings.push(
      "Duct velocity is high. Noise and pressure drop may increase."
    );
  }

  if (straightDuctLoss > 80) {
    warnings.push(
      "Straight duct pressure loss is high. Check duct size or route length."
    );
  }

  if (fittingTotal > 150) {
    warnings.push(
      "Fitting loss is high. Reduce elbows/tees or improve duct routing."
    );
  }

  if (totalStaticPressure > 1200) {
    warnings.push(
      "Total static pressure is high. Fan selection must be carefully checked."
    );
  }

  return {
    airflowCMH: num(airflowCMH),
    velocityMS: velocity,
    straightLengthM: num(straightLengthM),
    straightDuctLoss: Number(round(straightDuctLoss, 2)),
    elbowLoss: Number(round(elbowLoss, 2)),
    reducerLoss: Number(round(reducerLoss, 2)),
    teeLoss: Number(round(teeLoss, 2)),
    damperLoss: Number(round(damperLoss, 2)),
    fittingTotal: Number(round(fittingTotal, 2)),
    ductTotal: Number(round(ductTotal, 2)),
    preFilterPa: num(preFilterPa),
    fineFilterPa: num(fineFilterPa),
    coilPa: num(coilPa),
    hepaPa: num(hepaPa),
    diffuserPa: num(diffuserPa),
    terminalPa: num(terminalPa),
    equipmentLoss: Number(round(equipmentLoss, 2)),
    safetyMarginPa: num(safetyMarginPa),
    totalStaticPressure: Number(round(totalStaticPressure, 2)),
    recommendedFanPressure,
    warnings,
    breakdown: [
      { item: "Straight Duct", pressure: Number(round(straightDuctLoss, 2)) },
      { item: "Elbows", pressure: Number(round(elbowLoss, 2)) },
      { item: "Reducers", pressure: Number(round(reducerLoss, 2)) },
      { item: "Tees", pressure: Number(round(teeLoss, 2)) },
      { item: "Dampers", pressure: Number(round(damperLoss, 2)) },
      { item: "Pre Filter", pressure: num(preFilterPa) },
      { item: "Fine Filter", pressure: num(fineFilterPa) },
      { item: "Cooling Coil", pressure: num(coilPa) },
      { item: "HEPA", pressure: num(hepaPa) },
      { item: "Diffuser", pressure: num(diffuserPa) },
      { item: "Terminal", pressure: num(terminalPa) },
      { item: "Safety Margin", pressure: num(safetyMarginPa) },
    ],
  };
}

export function calculateFanPowerFromPressure({
  airflowCMH = 0,
  totalPressurePa = 900,
  fanEfficiency = 65,
}) {
  const airflowM3S = num(airflowCMH) / 3600;
  const pressure = num(totalPressurePa, 900);
  const efficiency = num(fanEfficiency, 65) / 100;

  const kw =
    (airflowM3S * pressure) /
    (1000 * efficiency);

  const hp = kw / 0.746;

  const standardHP = [
    0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50,
  ];

  const selectedHP =
    standardHP.find((h) => h >= hp) ||
    standardHP[standardHP.length - 1];

  return {
    airflowCMH: num(airflowCMH),
    totalPressurePa: pressure,
    fanEfficiency: fanEfficiency,
    fanKW: Number(round(kw, 2)),
    calculatedHP: Number(round(hp, 2)),
    selectedMotorHP: selectedHP,
  };
}