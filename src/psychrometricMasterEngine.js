function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.27 * tempC) / (tempC + 237.3));
}

export function calculatePsychrometrics({
  dbt = 35,
  rh = 60,
  pressureKPa = 101.325,
}) {
  const pws = saturationPressureKPa(dbt);
  const pv = (rh / 100) * pws;

  const humidityRatio =
    0.62198 * pv / (pressureKPa - pv);

  const enthalpy =
    1.006 * dbt +
    humidityRatio * (2501 + 1.86 * dbt);

  const dewPoint =
    (237.3 * Math.log(pv / 0.61078)) /
    (17.27 - Math.log(pv / 0.61078));

  const specificVolume =
    (0.287042 * (dbt + 273.15) * (1 + 1.607858 * humidityRatio)) /
    pressureKPa;

  return {
    dbt,
    rh,
    pressureKPa,
    humidityRatio,
    humidityRatioGPKG: humidityRatio * 1000,
    enthalpy,
    dewPoint,
    specificVolume,
  };
}

export function calculatePsychrometricProcess({
  outsideDBT = 35,
  outsideRH = 60,
  roomDBT = 22,
  roomRH = 50,
  supplyDBT = 14,
  supplyRH = 90,
  airflowCMH = 2250,
}) {
  const outside = calculatePsychrometrics({
    dbt: outsideDBT,
    rh: outsideRH,
  });

  const room = calculatePsychrometrics({
    dbt: roomDBT,
    rh: roomRH,
  });

  const supply = calculatePsychrometrics({
    dbt: supplyDBT,
    rh: supplyRH,
  });

  const airMassFlow =
    airflowCMH / 3600 / outside.specificVolume;

  const totalCoolingKW =
    airMassFlow * (outside.enthalpy - supply.enthalpy);

  const sensibleCoolingKW =
    airMassFlow * 1.006 * (outsideDBT - supplyDBT);

  const latentCoolingKW =
    totalCoolingKW - sensibleCoolingKW;

  const moistureRemovalKgHr =
    airMassFlow *
    (outside.humidityRatio - supply.humidityRatio) *
    3600;

  const roomToSupplyDeltaH =
    room.enthalpy - supply.enthalpy;

  return {
    outside,
    room,
    supply,
    airMassFlow,
    totalCoolingKW,
    totalCoolingTR: totalCoolingKW / 3.517,
    sensibleCoolingKW,
    latentCoolingKW,
    moistureRemovalKgHr,
    roomToSupplyDeltaH,
    processPoints: [
      {
        name: "Outside Air",
        dbt: outside.dbt,
        humidityRatio: outside.humidityRatioGPKG,
        enthalpy: outside.enthalpy,
      },
      {
        name: "Cooling Coil Leaving",
        dbt: supply.dbt,
        humidityRatio: supply.humidityRatioGPKG,
        enthalpy: supply.enthalpy,
      },
      {
        name: "Room Condition",
        dbt: room.dbt,
        humidityRatio: room.humidityRatioGPKG,
        enthalpy: room.enthalpy,
      },
    ],
  };
}

export function getPsychrometricWarnings(process) {
  const warnings = [];

  if (process.latentCoolingKW < 0) {
    warnings.push(
      "Latent cooling is negative. Check RH and supply air condition."
    );
  }

  if (process.moistureRemovalKgHr < 0) {
    warnings.push(
      "Moisture removal is negative. Supply air humidity may be higher than outside air."
    );
  }

  if (process.supply.rh > 95) {
    warnings.push(
      "Supply air RH is very high. Condensation risk must be checked."
    );
  }

  if (process.room.rh > 60) {
    warnings.push(
      "Room RH is above typical pharma comfort/control range. Check process requirement."
    );
  }

  return warnings;
}