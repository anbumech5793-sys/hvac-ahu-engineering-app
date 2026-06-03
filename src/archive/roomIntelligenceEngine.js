export const roomDatabase = {
  granulation: {
    roomType: "Granulation",
    cleanroomClass: "ISO 8",
    achRange: "20–30 ACH",
    recommendedACH: 25,
    pressure: "+15 Pa",
    filterTrain: "G4 Pre Filter + F8 Fine Filter + H14 HEPA",
    airflowPattern: "Turbulent Mixing",
    riskLevel: "Medium dust/process risk",
    notes: "Dust extraction and containment should be considered. Final airflow must be validated by particle count and recovery test.",
  },

  compression: {
    roomType: "Compression",
    cleanroomClass: "ISO 8",
    achRange: "20–30 ACH",
    recommendedACH: 25,
    pressure: "+10 to +15 Pa",
    filterTrain: "G4 + F8 + H14 HEPA",
    airflowPattern: "Turbulent Mixing",
    riskLevel: "High dust risk",
    notes: "Local dust extraction is strongly recommended near compression machine.",
  },

  coating: {
    roomType: "Coating",
    cleanroomClass: "ISO 8",
    achRange: "20–25 ACH",
    recommendedACH: 22,
    pressure: "+10 Pa",
    filterTrain: "G4 + F8 + H14 HEPA",
    airflowPattern: "Turbulent Mixing",
    riskLevel: "Heat/solvent/process exhaust risk",
    notes: "Exhaust and solvent safety must be reviewed based on coating process.",
  },

  packing: {
    roomType: "Packing",
    cleanroomClass: "ISO 8 / Controlled based on product",
    achRange: "15–25 ACH",
    recommendedACH: 18,
    pressure: "+5 to +10 Pa",
    filterTrain: "G4 + F8",
    airflowPattern: "Comfort / Controlled Mixing",
    riskLevel: "Low to medium",
    notes: "HEPA may be required depending on product exposure and GMP risk.",
  },

  sterileFilling: {
    roomType: "Sterile Filling",
    cleanroomClass: "Grade A/B as per sterile requirement",
    achRange: "40–60 ACH or validated airflow",
    recommendedACH: 50,
    pressure: "+25 Pa or validated cascade",
    filterTrain: "Terminal H14 HEPA / LAF / RABS / Isolator based on process",
    airflowPattern: "Unidirectional / Controlled Clean Air",
    riskLevel: "Critical sterile risk",
    notes: "Must follow EU GMP Annex 1 contamination control strategy and full qualification.",
  },

  warehouse: {
    roomType: "Warehouse",
    cleanroomClass: "Controlled / Non-classified",
    achRange: "6–12 ACH",
    recommendedACH: 8,
    pressure: "Neutral / slightly positive",
    filterTrain: "G4 + F7/F8",
    airflowPattern: "Comfort Ventilation",
    riskLevel: "Low",
    notes: "Temperature and RH control depend on material storage requirement.",
  },
};

export function getRoomDesignBasis(roomUse) {
  const key = String(roomUse || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  if (key.includes("granulation")) return roomDatabase.granulation;
  if (key.includes("compression")) return roomDatabase.compression;
  if (key.includes("coating")) return roomDatabase.coating;
  if (key.includes("packing")) return roomDatabase.packing;
  if (key.includes("sterile") || key.includes("filling")) return roomDatabase.sterileFilling;
  if (key.includes("warehouse") || key.includes("store")) return roomDatabase.warehouse;

  return {
    roomType: "General Pharma Room",
    cleanroomClass: "To be selected by risk assessment",
    achRange: "15–25 ACH preliminary",
    recommendedACH: 20,
    pressure: "+10 Pa preliminary",
    filterTrain: "G4 + F8 + HEPA if required",
    airflowPattern: "Turbulent Mixing",
    riskLevel: "Requires URS/risk assessment",
    notes: "Room type not recognized. Use project URS, GMP risk assessment, and validation requirement.",
  };
}