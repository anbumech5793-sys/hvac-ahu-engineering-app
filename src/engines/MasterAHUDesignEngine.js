export function runMasterAHUDesignEngine(data) {
  const L = num(data.roomLength, 10);
  const W = num(data.roomWidth, 8);
  const H = num(data.roomHeight, 3);

  const people = num(data.peopleCount, 0);
  const lightingW = num(data.lightingLoad, 0);
  const equipmentW = num(data.equipmentLoad, 0);

  const indoorDBT = num(data.indoorTemp, 24);
  const outdoorDBT = num(data.outdoorTemp, 35);
  const indoorRH = num(data.relativeHumidity, 55);
  const outdoorRH = num(data.outdoorRH, 60);

  const wallU = num(data.wallU, 1.8);
  const roofU = num(data.roofU, 1.5);
  const glassU = num(data.glassU, 5.7);
  const glassArea = num(data.glassArea, 0);
  const solarFactor = num(data.solarFactor, 180);

  const safetyFactor = num(data.safetyFactor, 10);
  const cfmPerTR = num(data.cfmPerTR, 400);
  const freshAirPerPerson = num(data.freshAirPerPerson, 20);

  const floorArea = L * W;
  const volume = L * W * H;
  const wallArea = 2 * (L + W) * H;
  const roofArea = floorArea;

  const deltaT = Math.max(outdoorDBT - indoorDBT, 0);

  const indoor = psychrometric(indoorDBT, indoorRH);
  const outdoor = psychrometric(outdoorDBT, outdoorRH);

  const peopleSensible = people * 75;
  const peopleLatent = people * 55;

  const wallLoad = wallU * wallArea * deltaT;
  const roofLoad = roofU * roofArea * deltaT;
  const glassTransmissionLoad = glassU * glassArea * deltaT;
  const solarLoad = glassArea * solarFactor;

  const freshAirCFM = people * freshAirPerPerson;
  const freshAirM3s = freshAirCFM * 0.000471947;

  const freshAirSensible = 1.2 * freshAirM3s * 1006 * deltaT;

  const humidityDifference =
    Math.max(outdoor.humidityRatioKgKg - indoor.humidityRatioKgKg, 0);

  const freshAirLatent =
    1.2 * freshAirM3s * 2501000 * humidityDifference;

  const totalSensible =
    peopleSensible +
    lightingW +
    equipmentW +
    wallLoad +
    roofLoad +
    glassTransmissionLoad +
    solarLoad +
    freshAirSensible;

  const totalLatent = peopleLatent + freshAirLatent;

  const totalWatts = totalSensible + totalLatent;
  const totalTR = totalWatts / 3517;
  const designTR = totalTR * (1 + safetyFactor / 100);

  const requiredCFM = designTR * cfmPerTR;

  const SHR =
    totalWatts > 0 ? totalSensible / totalWatts : 0;

  const roomACH =
    volume > 0 ? (requiredCFM * 1.699) / volume : 0;

  const ahuLength = Math.round(2500 + designTR * 80);
  const ahuWidth = Math.round(1000 + requiredCFM * 0.035);
  const ahuHeight = Math.round(1200 + requiredCFM * 0.04);

  const coilTR = designTR;
  const coilKW = coilTR * 3.517;

  const chilledWaterDeltaT = 5;
  const chilledWaterFlowLPM =
    (coilKW * 860) / (chilledWaterDeltaT * 60);

  const blowerCFM = requiredCFM;
  const filterCFM = requiredCFM;
  const ductCFM = requiredCFM;

  return {
    floorArea: round(floorArea),
    volume: round(volume),
    wallArea: round(wallArea),
    roofArea: round(roofArea),

    indoorDBT: round(indoorDBT),
    outdoorDBT: round(outdoorDBT),
    indoorRH: round(indoorRH),
    outdoorRH: round(outdoorRH),
    deltaT: round(deltaT),

    indoorHumidityRatio: round(indoor.humidityRatioGkg),
    outdoorHumidityRatio: round(outdoor.humidityRatioGkg),
    indoorEnthalpy: round(indoor.enthalpy),
    outdoorEnthalpy: round(outdoor.enthalpy),
    indoorDewPoint: round(indoor.dewPoint),
    outdoorDewPoint: round(outdoor.dewPoint),

    peopleSensible: round(peopleSensible),
    peopleLatent: round(peopleLatent),
    lightingLoad: round(lightingW),
    equipmentLoad: round(equipmentW),
    wallLoad: round(wallLoad),
    roofLoad: round(roofLoad),
    glassTransmissionLoad: round(glassTransmissionLoad),
    solarLoad: round(solarLoad),
    freshAirCFM: round(freshAirCFM),
    freshAirSensible: round(freshAirSensible),
    freshAirLatent: round(freshAirLatent),

    totalSensible: round(totalSensible),
    totalLatent: round(totalLatent),
    totalWatts: round(totalWatts),
    totalKW: round(totalWatts / 1000),
    totalTR: round(totalTR),
    designTR: round(designTR),
    requiredCFM: round(requiredCFM),
    SHR: round(SHR),
    roomACH: round(roomACH),

    ahuLength,
    ahuWidth,
    ahuHeight,

    coilTR: round(coilTR),
    coilKW: round(coilKW),
    chilledWaterFlowLPM: round(chilledWaterFlowLPM),

    blowerCFM: round(blowerCFM),
    filterCFM: round(filterCFM),
    ductCFM: round(ductCFM),
  };
}

function psychrometric(dbt, rh) {
  const pressure = 101.325;

  const pws =
    0.61078 * Math.exp((17.2694 * dbt) / (dbt + 237.3));

  const pw = (rh / 100) * pws;

  const humidityRatioKgKg =
    (0.62198 * pw) / (pressure - pw);

  const humidityRatioGkg = humidityRatioKgKg * 1000;

  const enthalpy =
    1.006 * dbt + humidityRatioKgKg * (2501 + 1.86 * dbt);

  const dewPoint =
    (237.3 * Math.log(pw / 0.61078)) /
    (17.2694 - Math.log(pw / 0.61078));

  return {
    humidityRatioKgKg,
    humidityRatioGkg,
    enthalpy,
    dewPoint,
  };
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value) {
  return Number(Number(value || 0).toFixed(2));
}