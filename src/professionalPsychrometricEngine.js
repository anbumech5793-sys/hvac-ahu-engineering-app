const ATM_PRESSURE_KPA = 101.325;
const CP_DRY_AIR = 1.006;
const CP_WATER_VAPOR = 1.86;
const HFG_0C = 2501;

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

/* ================= PSYCHROMETRIC BASIC FORMULAS ================= */

export function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.2694 * tempC) / (tempC + 237.3));
}

export function humidityRatioKgKg({
  dbtC = 25,
  rhPercent = 50,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  const pws = saturationPressureKPa(num(dbtC));
  const pv = (num(rhPercent) / 100) * pws;

  return 0.62198 * pv / (num(pressureKPa, ATM_PRESSURE_KPA) - pv);
}

export function enthalpyKJkg({
  dbtC = 25,
  humidityRatio = 0.01,
}) {
  const t = num(dbtC);
  const w = num(humidityRatio);

  return CP_DRY_AIR * t + w * (HFG_0C + CP_WATER_VAPOR * t);
}

export function dewPointC({
  dbtC = 25,
  rhPercent = 50,
}) {
  const pws = saturationPressureKPa(num(dbtC));
  const pv = (num(rhPercent) / 100) * pws;

  const ln = Math.log(pv / 0.61078);
  return (237.3 * ln) / (17.2694 - ln);
}

export function specificVolumeM3kg({
  dbtC = 25,
  humidityRatio = 0.01,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  return (
    (0.287042 *
      (num(dbtC) + 273.15) *
      (1 + 1.607858 * num(humidityRatio))) /
    num(pressureKPa, ATM_PRESSURE_KPA)
  );
}

export function wetBulbApproxC({
  dbtC = 25,
  rhPercent = 50,
}) {
  const t = num(dbtC);
  const rh = num(rhPercent);

  // Stull approximation for wet bulb temperature
  const tw =
    t * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(t + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;

  return tw;
}

export function psychrometricState({
  name = "State",
  dbtC = 25,
  rhPercent = 50,
  pressureKPa = ATM_PRESSURE_KPA,
}) {
  const w = humidityRatioKgKg({
    dbtC,
    rhPercent,
    pressureKPa,
  });

  const h = enthalpyKJkg({
    dbtC,
    humidityRatio: w,
  });

  const dp = dewPointC({
    dbtC,
    rhPercent,
  });

  const wb = wetBulbApproxC({
    dbtC,
    rhPercent,
  });

  const sv = specificVolumeM3kg({
    dbtC,
    humidityRatio: w,
    pressureKPa,
  });

  return {
    name,
    dbtC: num(dbtC),
    rhPercent: num(rhPercent),
    wetBulbC: Number(round(wb, 2)),
    dewPointC: Number(round(dp, 2)),
    humidityRatioKgKg: Number(round(w, 5)),
    humidityRatioGkg: Number(round(w * 1000, 2)),
    enthalpyKJkg: Number(round(h, 2)),
    specificVolumeM3kg: Number(round(sv, 3)),
  };
}

/* ================= PROCESS CALCULATION ================= */

export function calculatePsychrometricProcess({
  outsideDBT = 35,
  outsideRH = 60,
  roomDBT = 22,
  roomRH = 50,
  supplyDBT = 14,
  supplyRH = 90,
  airflowCMH = 2250,
}) {
  const outside = psychrometricState({
    name: "Outside Air",
    dbtC: outsideDBT,
    rhPercent: outsideRH,
  });

  const room = psychrometricState({
    name: "Room Air",
    dbtC: roomDBT,
    rhPercent: roomRH,
  });

  const supply = psychrometricState({
    name: "Supply Air",
    dbtC: supplyDBT,
    rhPercent: supplyRH,
  });

  const massFlowKgS =
    (num(airflowCMH) / 3600) / outside.specificVolumeM3kg;

  const totalCoolingKW =
    massFlowKgS * (outside.enthalpyKJkg - supply.enthalpyKJkg);

  const sensibleCoolingKW =
    massFlowKgS * CP_DRY_AIR * (num(outsideDBT) - num(supplyDBT));

  const latentCoolingKW =
    totalCoolingKW - sensibleCoolingKW;

  const moistureRemovalKgHr =
    massFlowKgS *
    (outside.humidityRatioKgKg - supply.humidityRatioKgKg) *
    3600;

  const roomToSupplyTotalKW =
    massFlowKgS * (room.enthalpyKJkg - supply.enthalpyKJkg);

  const sensibleHeatRatio =
    totalCoolingKW !== 0
      ? sensibleCoolingKW / totalCoolingKW
      : 0;

  const apparatusDewPointC =
    supply.dewPointC - 1.5;

  const bypassFactor =
    (supplyDBT - apparatusDewPointC) /
    (roomDBT - apparatusDewPointC);

  const warnings = [];

  if (latentCoolingKW < 0) {
    warnings.push(
      "Latent cooling is negative. Check supply RH and outdoor/room humidity conditions."
    );
  }

  if (moistureRemovalKgHr < 0) {
    warnings.push(
      "Moisture removal is negative. Supply air humidity is higher than outside air."
    );
  }

  if (supply.rhPercent > 95) {
    warnings.push(
      "Supply air RH is very high. Check condensation risk at diffuser and duct surface."
    );
  }

  if (room.rhPercent > 60) {
    warnings.push(
      "Room RH is above common pharma comfort/control range. Check product requirement."
    );
  }

  return {
    input: {
      outsideDBT,
      outsideRH,
      roomDBT,
      roomRH,
      supplyDBT,
      supplyRH,
      airflowCMH,
    },

    states: {
      outside,
      room,
      supply,
    },

    process: {
      massFlowKgS: Number(round(massFlowKgS, 3)),
      totalCoolingKW: Number(round(totalCoolingKW, 2)),
      totalCoolingTR: Number(round(totalCoolingKW / 3.517, 2)),
      sensibleCoolingKW: Number(round(sensibleCoolingKW, 2)),
      latentCoolingKW: Number(round(latentCoolingKW, 2)),
      moistureRemovalKgHr: Number(round(moistureRemovalKgHr, 2)),
      roomToSupplyTotalKW: Number(round(roomToSupplyTotalKW, 2)),
      sensibleHeatRatio: Number(round(sensibleHeatRatio, 2)),
      apparatusDewPointC: Number(round(apparatusDewPointC, 2)),
      bypassFactor: Number(round(bypassFactor, 3)),
    },

    chartPoints: [
      {
        name: "Outside Air",
        dbt: outside.dbtC,
        humidityRatio: outside.humidityRatioGkg,
        enthalpy: outside.enthalpyKJkg,
      },
      {
        name: "Supply Air",
        dbt: supply.dbtC,
        humidityRatio: supply.humidityRatioGkg,
        enthalpy: supply.enthalpyKJkg,
      },
      {
        name: "Room Air",
        dbt: room.dbtC,
        humidityRatio: room.humidityRatioGkg,
        enthalpy: room.enthalpyKJkg,
      },
    ],

    warnings,
  };
}

/* ================= RH CURVE GENERATOR FOR CHART ================= */

export function generateRHCurve(rhPercent = 50) {
  const data = [];

  for (let t = 0; t <= 50; t += 2) {
    const w = humidityRatioKgKg({
      dbtC: t,
      rhPercent,
    });

    data.push({
      dbt: t,
      humidityRatio: Number(round(w * 1000, 2)),
    });
  }

  return data;
}

export function runProfessionalPsychrometricEngine(input = {}) {
  const result = calculatePsychrometricProcess({
    outsideDBT: input.outsideDBT || 35,
    outsideRH: input.outsideRH || 60,
    roomDBT: input.roomDBT || input.temperature || 22,
    roomRH: input.roomRH || input.rh || 50,
    supplyDBT: input.supplyDBT || 14,
    supplyRH: input.supplyRH || 90,
    airflowCMH: input.airflowCMH || 2250,
  });

  return {
    ...result,
    rhCurves: {
      rh30: generateRHCurve(30),
      rh50: generateRHCurve(50),
      rh70: generateRHCurve(70),
      rh90: generateRHCurve(90),
      rh100: generateRHCurve(100),
    },
  };
}