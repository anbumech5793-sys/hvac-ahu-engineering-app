export function runMasterAHUDesignEngine(projectData = {}) {
  const roomLength = n(projectData.roomLength, 10);
  const roomWidth = n(projectData.roomWidth, 8);
  const roomHeight = n(projectData.roomHeight, 3);

  const peopleCount = n(projectData.peopleCount, 10);
  const lightingLoad = n(projectData.lightingLoad, 1200);
  const equipmentLoad = n(projectData.equipmentLoad, 2500);

  const indoorTemp = n(projectData.indoorTemp, 24);
  const outdoorTemp = n(projectData.outdoorTemp, 35);
  const relativeHumidity = n(projectData.relativeHumidity, 55);

  const wallU = n(projectData.wallU, 1.8);
  const roofU = n(projectData.roofU, 1.5);
  const glassU = n(projectData.glassU, 5.7);
  const glassArea = n(projectData.glassArea, 0);
  const solarFactor = n(projectData.solarFactor, 180);

  const cfmPerTR = n(projectData.cfmPerTR, 400);
  const safetyFactor = n(projectData.safetyFactor, 1.15);
  const fanEfficiency = n(projectData.defaultFanEfficiency, 65) / 100;
  const staticPressure = n(projectData.staticPressure, 75);

  const floorArea = roomLength * roomWidth;
  const volume = floorArea * roomHeight;
  const wallArea = 2 * (roomLength + roomWidth) * roomHeight;
  const roofArea = floorArea;

  const deltaT = Math.max(outdoorTemp - indoorTemp, 1);

  const peopleSensible = peopleCount * 75;
  const peopleLatent = peopleCount * 55;

  const wallLoad = wallArea * wallU * deltaT;
  const roofLoad = roofArea * roofU * deltaT;
  const glassLoad = glassArea * glassU * deltaT + glassArea * solarFactor;

  const freshAirCFM = Math.max(peopleCount * 15, n(projectData.freshAirCFM, 0));
  const freshAirSensible = 1.08 * freshAirCFM * (deltaT * 1.8);
  const freshAirLatent = freshAirCFM * 0.68 * Math.max(relativeHumidity - 50, 0);

  const totalSensible =
    peopleSensible +
    lightingLoad +
    equipmentLoad +
    wallLoad +
    roofLoad +
    glassLoad +
    freshAirSensible;

  const totalLatent = peopleLatent + freshAirLatent;

  const totalWatts = totalSensible + totalLatent;
  const totalTR = totalWatts / 3517;
  const designTR = totalTR * safetyFactor;

  const requiredCFM = Math.max(designTR * cfmPerTR, volume * 6 / 60 * 35.3147);
  const roomACH = (requiredCFM * 1.699) / Math.max(volume, 1);

  const SHR = totalSensible / Math.max(totalWatts, 1);

  const coilTR = designTR * 1.05;
  const coilKW = coilTR * 3.517;
  const chilledWaterFlowLPM = (coilTR * 3024) / (500 * 10) * 3.785;

  const blowerCFM = requiredCFM * 1.05;
  const motorHP = (blowerCFM * staticPressure) / (6356 * Math.max(fanEfficiency, 0.01));
  const selectedMotorHP = selectMotorHP(motorHP);
  const motorKW = selectedMotorHP * 0.746;

  const filterCFM = requiredCFM;
  const ductCFM = requiredCFM;

  const ahuLength = Math.round(2200 + requiredCFM * 0.45);
  const ahuWidth = Math.round(750 + Math.sqrt(requiredCFM) * 12);
  const ahuHeight = Math.round(900 + Math.sqrt(requiredCFM) * 10);

  const indoorDBT = indoorTemp;
  const outdoorDBT = outdoorTemp;
  const indoorRH = relativeHumidity;
  const outdoorRH = n(projectData.outdoorRH, 60);

  const indoorHumidityRatio = humidityRatio(indoorDBT, indoorRH);
  const outdoorHumidityRatio = humidityRatio(outdoorDBT, outdoorRH);

  const indoorEnthalpy = enthalpy(indoorDBT, indoorHumidityRatio / 1000);
  const outdoorEnthalpy = enthalpy(outdoorDBT, outdoorHumidityRatio / 1000);
  const indoorDewPoint = dewPointApprox(indoorDBT, indoorRH);

  const supplyDBT = Math.max(indoorDBT - 10, 12);
  const coilADP = Math.max(supplyDBT - 2, 10);

  return {
    floorArea: r(floorArea),
    volume: r(volume),
    wallArea: r(wallArea),
    roofArea: r(roofArea),

    indoorDBT: r(indoorDBT),
    outdoorDBT: r(outdoorDBT),
    indoorRH: r(indoorRH),
    outdoorRH: r(outdoorRH),
    indoorHumidityRatio: r(indoorHumidityRatio),
    outdoorHumidityRatio: r(outdoorHumidityRatio),
    indoorEnthalpy: r(indoorEnthalpy),
    outdoorEnthalpy: r(outdoorEnthalpy),
    indoorDewPoint: r(indoorDewPoint),
    supplyDBT: r(supplyDBT),
    coilADP: r(coilADP),

    peopleSensible: r(peopleSensible),
    peopleLatent: r(peopleLatent),
    lightingLoad: r(lightingLoad),
    equipmentLoad: r(equipmentLoad),
    wallLoad: r(wallLoad),
    roofLoad: r(roofLoad),
    glassLoad: r(glassLoad),
    freshAirSensible: r(freshAirSensible),
    freshAirLatent: r(freshAirLatent),

    totalSensible: r(totalSensible),
    totalLatent: r(totalLatent),
    totalWatts: r(totalWatts),
    totalTR: r(totalTR),
    designTR: r(designTR),
    SHR: r(SHR),

    freshAirCFM: r(freshAirCFM),
    requiredCFM: r(requiredCFM),
    roomACH: r(roomACH),
    cfmPerTR: r(cfmPerTR),

    coilTR: r(coilTR),
    coilKW: r(coilKW),
    chilledWaterFlowLPM: r(chilledWaterFlowLPM),

    blowerCFM: r(blowerCFM),
    staticPressure: r(staticPressure),
    motorHP: r(motorHP),
    selectedMotorHP: r(selectedMotorHP),
    motorKW: r(motorKW),

    filterCFM: r(filterCFM),
    ductCFM: r(ductCFM),

    ahuLength,
    ahuWidth,
    ahuHeight,
  };
}

function n(value, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

function r(value) {
  return Number(n(value).toFixed(2));
}

function selectMotorHP(hp) {
  const standard = [0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 12.5, 15, 20, 25, 30, 40, 50, 60, 75, 100];
  return standard.find((x) => x >= hp) || Math.ceil(hp);
}

function saturationPressureKPa(tempC) {
  return 0.61078 * Math.exp((17.2694 * tempC) / (tempC + 237.3));
}

function humidityRatio(tempC, rhPercent, pressureKPa = 101.325) {
  const rh = Math.max(0, Math.min(rhPercent / 100, 1));
  const pws = saturationPressureKPa(tempC);
  const pw = rh * pws;
  return (0.62198 * pw) / (pressureKPa - pw) * 1000;
}

function enthalpy(tempC, humidityRatioKgKg) {
  return 1.006 * tempC + humidityRatioKgKg * (2501 + 1.86 * tempC);
}

function dewPointApprox(tempC, rhPercent) {
  const RH = Math.max(1, Math.min(rhPercent, 100));
  const a = 17.27;
  const b = 237.7;
  const alpha = (a * tempC) / (b + tempC) + Math.log(RH / 100);
  return (b * alpha) / (a - alpha);
}