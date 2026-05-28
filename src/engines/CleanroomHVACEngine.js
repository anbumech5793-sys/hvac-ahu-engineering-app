export function runCleanroomHVACEngine(data, designResult = {}) {
  const roomLength = num(data.roomLength, 10);
  const roomWidth = num(data.roomWidth, 8);
  const roomHeight = num(data.roomHeight, 3);

  const roomVolume = roomLength * roomWidth * roomHeight;
  const floorArea = roomLength * roomWidth;

  const cleanroomClass = data.cleanroomClass || "ISO 8";
  const roomType = data.cleanroomRoomType || "General Pharma Room";

  const selectedACPH = getRecommendedACPH(cleanroomClass, roomType);

  const cleanroomAirflowCMH = roomVolume * selectedACPH;
  const cleanroomAirflowCFM = cleanroomAirflowCMH / 1.699;

  const heatLoadCFM = Number(designResult.requiredCFM || 0);

  const finalRequiredCFM = Math.max(cleanroomAirflowCFM, heatLoadCFM);
  const finalRequiredCMH = finalRequiredCFM * 1.699;

  const freshAirPercent = num(data.cleanroomFreshAirPercent, 10);
  const freshAirCFM = finalRequiredCFM * (freshAirPercent / 100);
  const recirculationCFM = finalRequiredCFM - freshAirCFM;

  const exhaustPercent = num(data.cleanroomExhaustPercent, 5);
  const exhaustCFM = finalRequiredCFM * (exhaustPercent / 100);

  const supplyCFM = finalRequiredCFM;
  const returnCFM = supplyCFM - exhaustCFM;

  const hepaFilterCFM = num(data.hepaFilterCFM, 500);
  const hepaFilterQty = Math.max(1, Math.ceil(supplyCFM / hepaFilterCFM));

  const targetRoomPressure = getRoomPressure(cleanroomClass);
  const pressureCascade = getPressureCascade(cleanroomClass);

  const recoveryTimeMinutes = calculateRecoveryTime(selectedACPH);

  const airChangeStatus =
    selectedACPH >= 20
      ? "Suitable for controlled pharma area"
      : "Low ACPH - verify cleanroom requirement";

  const airflowBasis =
    cleanroomAirflowCFM > heatLoadCFM
      ? "Cleanroom ACPH based airflow governs"
      : "Heat load based airflow governs";

  return {
    cleanroomClass,
    roomType,

    floorArea: round(floorArea),
    roomVolume: round(roomVolume),

    recommendedACPH: round(selectedACPH),
    cleanroomAirflowCMH: round(cleanroomAirflowCMH),
    cleanroomAirflowCFM: round(cleanroomAirflowCFM),

    heatLoadCFM: round(heatLoadCFM),
    finalRequiredCFM: round(finalRequiredCFM),
    finalRequiredCMH: round(finalRequiredCMH),

    freshAirPercent: round(freshAirPercent),
    freshAirCFM: round(freshAirCFM),
    recirculationCFM: round(recirculationCFM),

    exhaustPercent: round(exhaustPercent),
    exhaustCFM: round(exhaustCFM),
    supplyCFM: round(supplyCFM),
    returnCFM: round(returnCFM),

    hepaFilterCFM: round(hepaFilterCFM),
    hepaFilterQty,

    targetRoomPressure,
    pressureCascade,

    recoveryTimeMinutes: round(recoveryTimeMinutes),

    airChangeStatus,
    airflowBasis,
  };
}

function getRecommendedACPH(cleanroomClass, roomType) {
  const classMap = {
    "ISO 5": 240,
    "ISO 6": 120,
    "ISO 7": 60,
    "ISO 8": 25,
    "CNC": 10,
  };

  let acph = classMap[cleanroomClass] || 25;

  if (roomType === "Sterile Filling Room") acph += 60;
  if (roomType === "Packing Room") acph -= 5;
  if (roomType === "Material Air Lock") acph += 10;
  if (roomType === "Personnel Air Lock") acph += 10;
  if (roomType === "Granulation Room") acph += 15;
  if (roomType === "Compression Room") acph += 15;

  return Math.max(acph, 10);
}

function getRoomPressure(cleanroomClass) {
  const pressureMap = {
    "ISO 5": "+25 Pa",
    "ISO 6": "+20 Pa",
    "ISO 7": "+15 Pa",
    "ISO 8": "+10 Pa",
    "CNC": "+5 Pa",
  };

  return pressureMap[cleanroomClass] || "+10 Pa";
}

function getPressureCascade(cleanroomClass) {
  if (cleanroomClass === "ISO 5") {
    return "ISO 5 room should be highest pressure zone";
  }

  if (cleanroomClass === "ISO 6") {
    return "ISO 6 room should be positive to ISO 7 / ISO 8 area";
  }

  if (cleanroomClass === "ISO 7") {
    return "ISO 7 room should be positive to ISO 8 / CNC area";
  }

  if (cleanroomClass === "ISO 8") {
    return "ISO 8 room should be positive to uncontrolled corridor";
  }

  return "Maintain suitable pressure cascade as per GMP layout";
}

function calculateRecoveryTime(acph) {
  if (acph <= 0) return 0;

  return 180 / acph;
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value) {
  return Number(Number(value || 0).toFixed(2));
}