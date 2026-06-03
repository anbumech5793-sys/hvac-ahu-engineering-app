export function saturationPressureKPa(tempC) {
  const T = Number(tempC);
  return 0.61078 * Math.exp((17.2694 * T) / (T + 237.3));
}

export function humidityRatioFromRH(tempC, rhPercent, pressureKPa = 101.325) {
  const rh = Math.max(0, Math.min(Number(rhPercent) / 100, 1));
  const pws = saturationPressureKPa(tempC);
  const pw = rh * pws;

  return 0.62198 * pw / (pressureKPa - pw);
}

export function enthalpyKJkg(tempC, humidityRatioKgKg) {
  const T = Number(tempC);
  const W = Number(humidityRatioKgKg);

  return 1.006 * T + W * (2501 + 1.86 * T);
}

export function dewPointApprox(tempC, rhPercent) {
  const T = Number(tempC);
  const RH = Math.max(1, Math.min(Number(rhPercent), 100));
  const a = 17.27;
  const b = 237.7;

  const alpha = (a * T) / (b + T) + Math.log(RH / 100);
  return (b * alpha) / (a - alpha);
}

export function psychrometricPoint({
  label,
  tempC,
  rhPercent,
  pressureKPa = 101.325,
}) {
  const W = humidityRatioFromRH(tempC, rhPercent, pressureKPa);
  const h = enthalpyKJkg(tempC, W);
  const dp = dewPointApprox(tempC, rhPercent);

  return {
    label,
    dryBulb: round(tempC),
    rh: round(rhPercent),
    humidityRatio: round(W * 1000),
    humidityRatioKgKg: W,
    enthalpy: round(h),
    dewPoint: round(dp),
  };
}

export function generateRHCurve(rhPercent, minTemp = 5, maxTemp = 50) {
  const points = [];

  for (let t = minTemp; t <= maxTemp; t += 1) {
    const W = humidityRatioFromRH(t, rhPercent) * 1000;

    points.push({
      dryBulb: t,
      humidityRatio: round(W),
      rh: rhPercent,
    });
  }

  return points;
}

export function generatePsychrometricProcess(projectData = {}, designResult = {}) {
  const indoorTemp = number(designResult.indoorDBT || projectData.indoorTemp || 24);
  const indoorRH = number(designResult.indoorRH || projectData.relativeHumidity || 50);

  const outdoorTemp = number(designResult.outdoorDBT || projectData.outdoorTemp || 35);
  const outdoorRH = number(designResult.outdoorRH || 60);

  const supplyTemp = number(designResult.supplyDBT || designResult.coilADP || indoorTemp - 10);
  const supplyRH = 90;

  const freshAirRatio = 0.2;

  const roomPoint = psychrometricPoint({
    label: "Room Air",
    tempC: indoorTemp,
    rhPercent: indoorRH,
  });

  const outdoorPoint = psychrometricPoint({
    label: "Outdoor Air",
    tempC: outdoorTemp,
    rhPercent: outdoorRH,
  });

  const mixedTemp = outdoorTemp * freshAirRatio + indoorTemp * (1 - freshAirRatio);
  const mixedW =
    outdoorPoint.humidityRatioKgKg * freshAirRatio +
    roomPoint.humidityRatioKgKg * (1 - freshAirRatio);

  const mixedPoint = {
    label: "Mixed Air",
    dryBulb: round(mixedTemp),
    humidityRatio: round(mixedW * 1000),
    humidityRatioKgKg: mixedW,
    enthalpy: round(enthalpyKJkg(mixedTemp, mixedW)),
    rh: "-",
    dewPoint: "-",
  };

  const supplyPoint = psychrometricPoint({
    label: "Supply / Coil Leaving",
    tempC: supplyTemp,
    rhPercent: supplyRH,
  });

  return {
    rhCurves: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((rh) => ({
      rh,
      points: generateRHCurve(rh),
    })),

    processPoints: [
      outdoorPoint,
      mixedPoint,
      supplyPoint,
      roomPoint,
    ],

    roomPoint,
    outdoorPoint,
    mixedPoint,
    supplyPoint,
  };
}

export function fanCurvePoints(requiredCFM = 1500, staticPressure = 75) {
  const cfm = number(requiredCFM || 1500);
  const sp = number(staticPressure || 75);

  const points = [];

  for (let ratio = 0.3; ratio <= 1.5; ratio += 0.1) {
    const airflow = cfm * ratio;
    const pressure = Math.max(sp * (1.75 - 0.55 * ratio * ratio), sp * 0.25);
    const bhp = Math.max((airflow * pressure) / 6356 / 0.65, 0);

    points.push({
      airflow: round(airflow),
      staticPressure: round(pressure),
      bhp: round(bhp),
    });
  }

  return points;
}

export function systemCurvePoints(requiredCFM = 1500, staticPressure = 75) {
  const cfm = number(requiredCFM || 1500);
  const sp = number(staticPressure || 75);

  const points = [];

  for (let ratio = 0.2; ratio <= 1.5; ratio += 0.1) {
    const airflow = cfm * ratio;
    const pressure = sp * ratio * ratio;

    points.push({
      airflow: round(airflow),
      staticPressure: round(pressure),
    });
  }

  return points;
}

function number(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round(value) {
  return Number(number(value).toFixed(2));
}
export function runProfessionalPsychrometricEngine(projectData = {}) {
  return generatePsychrometricProcess(projectData, {});
}