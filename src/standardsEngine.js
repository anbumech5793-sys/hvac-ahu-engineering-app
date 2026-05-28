export const standardsDatabase = {
  cleanroom: {
    primary: "ISO 14644-1:2015",
    purpose:
      "Classification of air cleanliness by airborne particle concentration in cleanrooms and clean zones.",
    note:
      "ISO class defines particle limits. It does not directly fix ACH, fan size, coil size, or motor HP.",
    source:
      "ISO 14644-1:2015",
  },

  cleanroomTesting: {
    primary: "ISO 14644-3",
    purpose:
      "Cleanroom performance testing and qualification methods.",
    note:
      "Final compliance must be verified by site testing, particle count testing, airflow testing, pressure testing, and qualification.",
    source:
      "ISO 14644-3",
  },

  pharmaSterile: {
    primary: "EU GMP Annex 1:2022",
    purpose:
      "Sterile medicinal product manufacturing guidance, cleanroom qualification, contamination control strategy, and environmental monitoring.",
    note:
      "Required mainly for sterile pharma applications. Non-sterile pharma may still use cleanroom principles based on risk.",
    source:
      "EU GMP Annex 1",
  },

  hvac: {
    primary: "ASHRAE",
    purpose:
      "HVAC engineering design guidance, thermal comfort, ventilation, loads, systems, and equipment references.",
    note:
      "ASHRAE is used as HVAC engineering design reference; final design must be checked by qualified HVAC engineers.",
    source:
      "ASHRAE Standards / ASHRAE Handbook",
  },

  filters: {
    primary: "EN 1822 / ISO 29463 / ISO 16890",
    purpose:
      "Air filter classification and HEPA/ULPA filter testing references.",
    note:
      "HEPA filters must be selected and tested based on required cleanroom classification and application risk.",
    source:
      "EN 1822 / ISO 29463 / ISO 16890",
  },

  ducting: {
    primary: "SMACNA",
    purpose:
      "Duct construction, sheet metal ductwork, leakage, fabrication, and installation guidance.",
    note:
      "Duct sizing depends on airflow, velocity, pressure loss, noise, and fabrication constraints.",
    source:
      "SMACNA HVAC Duct Construction Standards",
  },

  fans: {
    primary: "AMCA",
    purpose:
      "Fan performance, airflow, pressure, efficiency, and testing reference.",
    note:
      "Fan selection should be validated against actual manufacturer fan curve.",
    source:
      "AMCA fan standards",
  },
};

export function getStandardSummary(projectType, cleanroomClass) {
  const standards = [
    standardsDatabase.cleanroom,
    standardsDatabase.cleanroomTesting,
    standardsDatabase.hvac,
    standardsDatabase.filters,
    standardsDatabase.ducting,
    standardsDatabase.fans,
  ];

  if (
    projectType?.toLowerCase().includes("sterile") ||
    cleanroomClass?.toLowerCase().includes("grade")
  ) {
    standards.push(standardsDatabase.pharmaSterile);
  }

  return standards;
}

export function getDesignDisclaimer() {
  return {
    title: "Engineering Validation Required",
    text:
      "This software provides engineering design assistance. Final design must be reviewed, validated, tested, and approved by qualified HVAC/pharma cleanroom professionals. Site qualification, IQ/OQ/PQ, balancing, particle testing, pressure testing, and commissioning are mandatory before use.",
  };
}