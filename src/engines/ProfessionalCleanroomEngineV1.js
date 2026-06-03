export const CLEANROOM_CLASSES = {
  "ISO 5": {
    standard: "ISO 14644-1",
    recommendedACH: 240,
    pressurePa: 15,
    recoveryMinutes: 10,
    hepa: "H14 HEPA",
    particleLimit: "3,520 particles/m³ @ 0.5µm",
  },
  "ISO 6": {
    standard: "ISO 14644-1",
    recommendedACH: 150,
    pressurePa: 15,
    recoveryMinutes: 15,
    hepa: "H13/H14 HEPA",
    particleLimit: "35,200 particles/m³ @ 0.5µm",
  },
  "ISO 7": {
    standard: "ISO 14644-1",
    recommendedACH: 60,
    pressurePa: 10,
    recoveryMinutes: 20,
    hepa: "H13 HEPA",
    particleLimit: "352,000 particles/m³ @ 0.5µm",
  },
  "ISO 8": {
    standard: "ISO 14644-1",
    recommendedACH: 25,
    pressurePa: 5,
    recoveryMinutes: 30,
    hepa: "Fine Filter / HEPA Optional",
    particleLimit: "3,520,000 particles/m³ @ 0.5µm",
  },
  "EU GMP Grade A": {
    standard: "EU GMP Annex 1",
    recommendedACH: 300,
    pressurePa: 15,
    recoveryMinutes: 10,
    hepa: "H14 HEPA / Laminar Flow",
    particleLimit: "Grade A sterile zone",
  },
  "EU GMP Grade B": {
    standard: "EU GMP Annex 1",
    recommendedACH: 90,
    pressurePa: 15,
    recoveryMinutes: 15,
    hepa: "H14 HEPA",
    particleLimit: "Grade B background",
  },
  "EU GMP Grade C": {
    standard: "EU GMP Annex 1",
    recommendedACH: 45,
    pressurePa: 10,
    recoveryMinutes: 20,
    hepa: "H13/H14 HEPA",
    particleLimit: "Grade C cleanroom",
  },
  "EU GMP Grade D": {
    standard: "EU GMP Annex 1",
    recommendedACH: 20,
    pressurePa: 5,
    recoveryMinutes: 30,
    hepa: "Fine Filter / HEPA Optional",
    particleLimit: "Grade D cleanroom",
  },
};

export function runProfessionalCleanroomEngineV1({
  projectData = {},
  designResult = {},
  cleanroomClass = "ISO 7",
  roomPressureType = "Positive",
  exhaustPercent = 10,
  leakagePercent = 5,
} = {}) {
  const selected =
    CLEANROOM_CLASSES[cleanroomClass] || CLEANROOM_CLASSES["ISO 7"];

  const roomLength = num(projectData.roomLength || 10);
  const roomWidth = num(projectData.roomWidth || 8);
  const roomHeight = num(projectData.roomHeight || 3);

  const floorArea = roomLength * roomWidth;
  const roomVolume = floorArea * roomHeight;

  const recommendedACH = selected.recommendedACH;
  const cleanroomCFM = (roomVolume * recommendedACH) / 1.699;

  const heatLoadCFM = num(designResult.requiredCFM || 0);
  const finalSupplyCFM = Math.max(cleanroomCFM, heatLoadCFM);

  const exhaustCFM = finalSupplyCFM * (num(exhaustPercent) / 100);
  const leakageCFM = finalSupplyCFM * (num(leakagePercent) / 100);

  const returnAirCFM =
    roomPressureType === "Negative"
      ? Math.max(finalSupplyCFM - exhaustCFM, 0)
      : Math.max(finalSupplyCFM - exhaustCFM - leakageCFM, 0);

  const freshAirCFM =
    roomPressureType === "Negative"
      ? exhaustCFM + leakageCFM
      : Math.max(exhaustCFM + leakageCFM, num(designResult.freshAirCFM || 0));

  const calculatedACH = (finalSupplyCFM * 1.699) / Math.max(roomVolume, 1);

  const pressureCascade =
    roomPressureType === "Positive"
      ? `Maintain +${selected.pressurePa} Pa pressure differential`
      : `Maintain -${selected.pressurePa} Pa pressure differential`;

  return {
    cleanroomClass,
    standard: selected.standard,
    roomPressureType,

    floorArea: round(floorArea),
    roomVolume: round(roomVolume),

    recommendedACH: round(recommendedACH),
    calculatedACH: round(calculatedACH),

    heatLoadCFM: round(heatLoadCFM),
    cleanroomCFM: round(cleanroomCFM),
    finalSupplyCFM: round(finalSupplyCFM),
    returnAirCFM: round(returnAirCFM),
    freshAirCFM: round(freshAirCFM),
    exhaustCFM: round(exhaustCFM),
    leakageCFM: round(leakageCFM),

    pressurePa: selected.pressurePa,
    pressureCascade,
    recoveryMinutes: selected.recoveryMinutes,
    hepaRequirement: selected.hepa,
    particleLimit: selected.particleLimit,

    designNotes: [
      "Final airflow is selected as the higher value between heat-load airflow and cleanroom ACH airflow.",
      "Pressure cascade should be validated using room leakage and door opening conditions.",
      "HEPA selection and terminal velocity must be checked as per project GMP requirement.",
      "Recovery time should be verified during cleanroom qualification.",
      "Particle limits must be validated by cleanroom testing as per applicable standard.",
    ],
  };
}

function num(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function round(value) {
  return Number(num(value).toFixed(2));
}