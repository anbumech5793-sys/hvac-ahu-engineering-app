export const industryTemplates = {
  Pharma: {
    rooms: {
      Granulation: {
        isoClass: "ISO 8",
        ach: 25,
        pressure: 15,
        filter: "G4 + F8 + H14 HEPA",
        temp: 22,
        rh: 50,
      },
      Compression: {
        isoClass: "ISO 8",
        ach: 25,
        pressure: 15,
        filter: "G4 + F8 + H14 HEPA",
        temp: 22,
        rh: 50,
      },
      "Sterile Filling": {
        isoClass: "Grade A/B",
        ach: 50,
        pressure: 25,
        filter: "Terminal H14 HEPA + LAF",
        temp: 20,
        rh: 45,
      },
      Packing: {
        isoClass: "Controlled / ISO 8",
        ach: 18,
        pressure: 10,
        filter: "G4 + F8",
        temp: 24,
        rh: 55,
      },
    },
  },

  Hospital: {
    rooms: {
      "Operation Theatre": {
        isoClass: "Critical Healthcare HVAC",
        ach: 25,
        pressure: 15,
        filter: "G4 + F8 + H14 HEPA",
        temp: 21,
        rh: 50,
      },
      ICU: {
        isoClass: "Healthcare Controlled",
        ach: 12,
        pressure: 10,
        filter: "G4 + F8 + HEPA if required",
        temp: 23,
        rh: 50,
      },
    },
  },

  Commercial: {
    rooms: {
      Office: {
        isoClass: "Comfort HVAC",
        ach: 6,
        pressure: 0,
        filter: "G4 + F7",
        temp: 24,
        rh: 55,
      },
      Mall: {
        isoClass: "Comfort HVAC",
        ach: 8,
        pressure: 0,
        filter: "G4 + F7",
        temp: 24,
        rh: 55,
      },
    },
  },

  Electronics: {
    rooms: {
      "PCB Assembly": {
        isoClass: "ISO 7 / ISO 8",
        ach: 30,
        pressure: 15,
        filter: "G4 + F8 + H14 HEPA",
        temp: 22,
        rh: 45,
      },
    },
  },

  Warehouse: {
    rooms: {
      "Material Storage": {
        isoClass: "Controlled / Non-classified",
        ach: 8,
        pressure: 0,
        filter: "G4 + F7",
        temp: 25,
        rh: 60,
      },
    },
  },
};

export function getIndustryRoomBasis(industry, room) {
  return (
    industryTemplates[industry]?.rooms?.[room] || {
      isoClass: "To be selected",
      ach: 20,
      pressure: 10,
      filter: "G4 + F8 + HEPA if required",
      temp: 22,
      rh: 50,
    }
  );
}