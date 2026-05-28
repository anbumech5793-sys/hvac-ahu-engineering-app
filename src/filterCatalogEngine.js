const FILTER_CATALOG = [
  {
    id: "G4-610-610-50",
    type: "Pre Filter",
    grade: "G4",
    size: "610 × 610 × 50 mm",
    widthMM: 610,
    heightMM: 610,
    depthMM: 50,
    ratedAirflowCMH: 1200,
    initialPressurePa: 45,
    finalPressurePa: 150,
    efficiency: "Coarse dust filtration",
    application: "AHU pre filtration",
    cost: 1200,
  },
  {
    id: "F7-610-610-150",
    type: "Fine Filter",
    grade: "F7",
    size: "610 × 610 × 150 mm",
    widthMM: 610,
    heightMM: 610,
    depthMM: 150,
    ratedAirflowCMH: 1100,
    initialPressurePa: 75,
    finalPressurePa: 250,
    efficiency: "Fine dust filtration",
    application: "Comfort / commercial HVAC",
    cost: 2800,
  },
  {
    id: "F8-610-610-150",
    type: "Fine Filter",
    grade: "F8",
    size: "610 × 610 × 150 mm",
    widthMM: 610,
    heightMM: 610,
    depthMM: 150,
    ratedAirflowCMH: 1000,
    initialPressurePa: 95,
    finalPressurePa: 300,
    efficiency: "High fine dust filtration",
    application: "Pharma AHU fine filtration",
    cost: 3500,
  },
  {
    id: "H13-610-610-150",
    type: "HEPA Filter",
    grade: "H13",
    size: "610 × 610 × 150 mm",
    widthMM: 610,
    heightMM: 610,
    depthMM: 150,
    ratedAirflowCMH: 900,
    initialPressurePa: 180,
    finalPressurePa: 450,
    efficiency: "HEPA filtration",
    application: "Cleanroom terminal filtration",
    cost: 6500,
  },
  {
    id: "H14-610-610-150",
    type: "HEPA Filter",
    grade: "H14",
    size: "610 × 610 × 150 mm",
    widthMM: 610,
    heightMM: 610,
    depthMM: 150,
    ratedAirflowCMH: 850,
    initialPressurePa: 220,
    finalPressurePa: 500,
    efficiency: "High efficiency HEPA filtration",
    application: "Pharma cleanroom terminal filtration",
    cost: 8500,
  },
];

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function getFilterByGrade(grade) {
  return FILTER_CATALOG.find((filter) => filter.grade === grade);
}

function estimateReplacementInterval({
  finalPressurePa,
  initialPressurePa,
  dustLevel = "medium",
}) {
  const pressureMargin = finalPressurePa - initialPressurePa;

  if (dustLevel === "low") {
    return pressureMargin > 250 ? "9–12 months" : "6–9 months";
  }

  if (dustLevel === "high") {
    return pressureMargin > 250 ? "3–6 months" : "2–4 months";
  }

  return pressureMargin > 250 ? "6–9 months" : "4–6 months";
}

export function selectFilterSet({
  airflowCMH = 0,
  application = "Pharma Cleanroom",
  cleanroomClass = "ISO 8",
  dustLevel = "medium",
}) {
  const airflow = num(airflowCMH);

  let grades = ["G4", "F8", "H14"];

  const app = String(application || "").toLowerCase();
  const cls = String(cleanroomClass || "").toLowerCase();

  if (app.includes("office") || app.includes("commercial")) {
    grades = ["G4", "F7"];
  }

  if (app.includes("warehouse")) {
    grades = ["G4", "F7"];
  }

  if (app.includes("pharma") || cls.includes("iso")) {
    grades = ["G4", "F8", "H14"];
  }

  if (cls.includes("iso 5") || cls.includes("grade a") || cls.includes("sterile")) {
    grades = ["G4", "F8", "H14"];
  }

  const selectedFilters = grades.map((grade) => {
    const filter = getFilterByGrade(grade);
    const quantity = Math.max(1, Math.ceil(airflow / filter.ratedAirflowCMH));

    const totalFaceAreaM2 =
      quantity * (filter.widthMM / 1000) * (filter.heightMM / 1000);

    const faceVelocityMS =
      airflow / 3600 / totalFaceAreaM2;

    const replacementInterval =
      estimateReplacementInterval({
        finalPressurePa: filter.finalPressurePa,
        initialPressurePa: filter.initialPressurePa,
        dustLevel,
      });

    return {
      ...filter,
      quantity,
      totalRatedAirflowCMH: quantity * filter.ratedAirflowCMH,
      totalFaceAreaM2: Number(round(totalFaceAreaM2, 3)),
      faceVelocityMS: Number(round(faceVelocityMS, 2)),
      totalInitialPressurePa: filter.initialPressurePa,
      totalFinalPressurePa: filter.finalPressurePa,
      replacementInterval,
      totalCost: quantity * filter.cost,
    };
  });

  const totalInitialPressurePa = selectedFilters.reduce(
    (sum, filter) => sum + filter.totalInitialPressurePa,
    0
  );

  const totalFinalPressurePa = selectedFilters.reduce(
    (sum, filter) => sum + filter.totalFinalPressurePa,
    0
  );

  const totalCost = selectedFilters.reduce(
    (sum, filter) => sum + filter.totalCost,
    0
  );

  const warnings = [];

  selectedFilters.forEach((filter) => {
    if (filter.faceVelocityMS > 2.8) {
      warnings.push(
        `${filter.grade}: Face velocity is high (${filter.faceVelocityMS} m/s). Increase filter quantity.`
      );
    }

    if (filter.faceVelocityMS < 1.0) {
      warnings.push(
        `${filter.grade}: Face velocity is low. Filter bank may be oversized.`
      );
    }
  });

  if (totalFinalPressurePa > 900) {
    warnings.push(
      "Total final filter pressure is high. Fan pressure margin must be checked."
    );
  }

  return {
    airflowCMH: airflow,
    application,
    cleanroomClass,
    dustLevel,
    selectedFilters,
    totalInitialPressurePa,
    totalFinalPressurePa,
    totalCost,
    warnings,
  };
}

export function getFilterCatalog() {
  return FILTER_CATALOG;
}