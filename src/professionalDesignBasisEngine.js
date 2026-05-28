const APPLICATION_LIBRARY = {
  pharma_cleanroom: {
    label: "Pharma Cleanroom",
    industry: "Pharmaceutical",
    defaultClass: "ISO 8",
    achRange: [20, 30],
    defaultACH: 25,
    temperatureC: 22,
    rhPercent: 50,
    pressurePa: 15,
    freshAirPercent: 20,
    exhaustPercent: 10,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 HEPA"],
    standards: [
      "ISO 14644-1",
      "ISO 14644-3",
      "EU GMP Annex 1 where applicable",
      "WHO GMP",
      "ASHRAE HVAC Fundamentals",
    ],
    notes: [
      "Maintain positive pressure against adjacent lower grade areas.",
      "HEPA integrity testing required after installation.",
      "Final qualification must include airflow, pressure, particle count and recovery test.",
    ],
  },

  sterile_area: {
    label: "Sterile Manufacturing Area",
    industry: "Pharmaceutical",
    defaultClass: "Grade B / ISO 7 with Grade A local zone",
    achRange: [40, 60],
    defaultACH: 50,
    temperatureC: 20,
    rhPercent: 45,
    pressurePa: 25,
    freshAirPercent: 25,
    exhaustPercent: 10,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 Terminal HEPA"],
    standards: [
      "EU GMP Annex 1",
      "ISO 14644-1",
      "ISO 14644-3",
      "WHO GMP",
    ],
    notes: [
      "Sterile zone requires strict contamination control.",
      "LAF / unidirectional airflow may be required for Grade A.",
      "Final design must be reviewed by pharma validation team.",
    ],
  },

  pharma_machine_ahu: {
    label: "Pharma Machine AHU",
    industry: "Pharmaceutical Machine",
    defaultClass: "Process AHU",
    achRange: [15, 25],
    defaultACH: 20,
    temperatureC: 22,
    rhPercent: 50,
    pressurePa: 10,
    freshAirPercent: 15,
    exhaustPercent: 10,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "HEPA if process required"],
    standards: [
      "ASHRAE HVAC Fundamentals",
      "WHO GMP",
      "Machine URS / Process Requirement",
    ],
    notes: [
      "Design depends on machine process requirement.",
      "Humidity control is critical for coating, granulation and drying process.",
      "Temperature/RH mapping may be required.",
    ],
  },

  office_hvac: {
    label: "Office HVAC",
    industry: "Commercial",
    defaultClass: "Comfort HVAC",
    achRange: [4, 8],
    defaultACH: 6,
    temperatureC: 24,
    rhPercent: 55,
    pressurePa: 0,
    freshAirPercent: 15,
    exhaustPercent: 5,
    filterTrain: ["G4 Pre Filter", "F7 Fine Filter"],
    standards: [
      "ASHRAE 62.1 ventilation reference",
      "ASHRAE HVAC Fundamentals",
      "NBC local building requirement where applicable",
    ],
    notes: [
      "Comfort HVAC design depends on occupancy and ventilation requirement.",
      "CO2 control may be considered for high occupancy.",
    ],
  },

  hospital_hvac: {
    label: "Hospital HVAC",
    industry: "Healthcare",
    defaultClass: "Healthcare Controlled",
    achRange: [12, 25],
    defaultACH: 15,
    temperatureC: 22,
    rhPercent: 50,
    pressurePa: 10,
    freshAirPercent: 25,
    exhaustPercent: 10,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "HEPA where required"],
    standards: [
      "ASHRAE 170 healthcare ventilation reference",
      "NABH / local healthcare requirement",
      "ISO 14644 where clean area applicable",
    ],
    notes: [
      "Healthcare rooms may require positive or negative pressure depending on usage.",
      "OT, ICU and isolation room must be treated separately.",
    ],
  },

  warehouse: {
    label: "Warehouse / Storage",
    industry: "Industrial / Storage",
    defaultClass: "Controlled / Non-classified",
    achRange: [6, 10],
    defaultACH: 8,
    temperatureC: 25,
    rhPercent: 60,
    pressurePa: 0,
    freshAirPercent: 10,
    exhaustPercent: 5,
    filterTrain: ["G4 Pre Filter", "F7 Fine Filter"],
    standards: [
      "ASHRAE HVAC Fundamentals",
      "Material storage requirement",
    ],
    notes: [
      "Temperature mapping may be required for pharma raw material storage.",
      "Humidity control depends on product storage requirement.",
    ],
  },
};

const CLEANROOM_CLASS_LIBRARY = {
  "ISO 5": {
    achRange: [240, 480],
    pressurePa: 25,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 Terminal HEPA"],
    notes: ["ISO 5 usually requires local unidirectional airflow / LAF."],
  },

  "ISO 6": {
    achRange: [90, 180],
    pressurePa: 20,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 HEPA"],
    notes: ["ISO 6 requires high airflow and strict leakage control."],
  },

  "ISO 7": {
    achRange: [40, 80],
    pressurePa: 15,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 HEPA"],
    notes: ["ISO 7 commonly used for pharma controlled areas."],
  },

  "ISO 8": {
    achRange: [20, 30],
    pressurePa: 10,
    filterTrain: ["G4 Pre Filter", "F8 Fine Filter", "H14 HEPA"],
    notes: ["ISO 8 commonly used for non-sterile pharma cleanrooms."],
  },

  "Comfort HVAC": {
    achRange: [4, 8],
    pressurePa: 0,
    filterTrain: ["G4 Pre Filter", "F7 Fine Filter"],
    notes: ["Comfort HVAC does not normally require HEPA filtration."],
  },
};

function normalizeKey(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replaceAll(" ", "_")
    .replaceAll("-", "_");
}

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function selectApplication(application) {
  const key = normalizeKey(application);

  if (APPLICATION_LIBRARY[key]) {
    return APPLICATION_LIBRARY[key];
  }

  if (key.includes("sterile")) return APPLICATION_LIBRARY.sterile_area;
  if (key.includes("machine") || key.includes("ahu")) return APPLICATION_LIBRARY.pharma_machine_ahu;
  if (key.includes("office")) return APPLICATION_LIBRARY.office_hvac;
  if (key.includes("hospital") || key.includes("ot") || key.includes("icu")) return APPLICATION_LIBRARY.hospital_hvac;
  if (key.includes("warehouse") || key.includes("store")) return APPLICATION_LIBRARY.warehouse;
  if (key.includes("pharma") || key.includes("clean")) return APPLICATION_LIBRARY.pharma_cleanroom;

  return APPLICATION_LIBRARY.pharma_cleanroom;
}

function selectCleanroomClass(cleanroomClass, applicationBasis) {
  if (cleanroomClass && CLEANROOM_CLASS_LIBRARY[cleanroomClass]) {
    return CLEANROOM_CLASS_LIBRARY[cleanroomClass];
  }

  const defaultClass = applicationBasis.defaultClass;

  if (CLEANROOM_CLASS_LIBRARY[defaultClass]) {
    return CLEANROOM_CLASS_LIBRARY[defaultClass];
  }

  if (String(defaultClass).includes("ISO 8")) {
    return CLEANROOM_CLASS_LIBRARY["ISO 8"];
  }

  if (String(defaultClass).includes("ISO 7")) {
    return CLEANROOM_CLASS_LIBRARY["ISO 7"];
  }

  return {
    achRange: applicationBasis.achRange,
    pressurePa: applicationBasis.pressurePa,
    filterTrain: applicationBasis.filterTrain,
    notes: [],
  };
}

export function generateProfessionalDesignBasis(input = {}) {
  const applicationBasis = selectApplication(input.application);
  const classBasis = selectCleanroomClass(input.cleanroomClass, applicationBasis);

  const length = num(input.length, 0);
  const width = num(input.width, 0);
  const height = num(input.height, 0);

  const areaM2 = length * width;
  const volumeM3 = areaM2 * height;

  const selectedACH = num(
    input.ach,
    applicationBasis.defaultACH || classBasis.achRange?.[0] || 20
  );

  const temperatureC = num(input.temperature, applicationBasis.temperatureC);
  const rhPercent = num(input.rh, applicationBasis.rhPercent);
  const pressurePa = num(input.pressure, classBasis.pressurePa);
  const freshAirPercent = num(input.freshAirPercent, applicationBasis.freshAirPercent);
  const exhaustPercent = num(input.exhaustPercent, applicationBasis.exhaustPercent);

  const supplyAirflowCMH = volumeM3 * selectedACH;
  const freshAirCMH = supplyAirflowCMH * (freshAirPercent / 100);
  const exhaustCMH = supplyAirflowCMH * (exhaustPercent / 100);
  const returnAirCMH = supplyAirflowCMH - freshAirCMH - exhaustCMH;

  const warnings = [];

  if (!length || !width || !height) {
    warnings.push("Room size is incomplete. Enter length, width and height.");
  }

  if (selectedACH < classBasis.achRange[0] || selectedACH > classBasis.achRange[1]) {
    warnings.push(
      `Selected ACH ${selectedACH} is outside recommended range ${classBasis.achRange[0]}-${classBasis.achRange[1]}.`
    );
  }

  if (returnAirCMH < 0) {
    warnings.push("Fresh air + exhaust air is higher than supply air. Check air balance.");
  }

  if (String(applicationBasis.label).toLowerCase().includes("pharma")) {
    warnings.push("Final pharma HVAC design must be validated by URS, DQ, IQ, OQ, PQ and site qualification.");
  }

  return {
    application: {
      key: normalizeKey(input.application),
      label: applicationBasis.label,
      industry: applicationBasis.industry,
    },

    room: {
      length,
      width,
      height,
      areaM2,
      volumeM3,
    },

    designBasis: {
      cleanroomClass: input.cleanroomClass || applicationBasis.defaultClass,
      ach: selectedACH,
      achRange: classBasis.achRange,
      temperatureC,
      rhPercent,
      pressurePa,
      freshAirPercent,
      exhaustPercent,
      filterTrain: input.filterTrain || classBasis.filterTrain,
      standards: applicationBasis.standards,
      notes: [...applicationBasis.notes, ...classBasis.notes],
    },

    airflow: {
      supplyAirflowCMH,
      freshAirCMH,
      returnAirCMH,
      exhaustCMH,
    },

    warnings,
  };
}

export function getApplicationOptions() {
  return Object.keys(APPLICATION_LIBRARY).map((key) => ({
    key,
    label: APPLICATION_LIBRARY[key].label,
  }));
}

export function getCleanroomClassOptions() {
  return Object.keys(CLEANROOM_CLASS_LIBRARY);
}