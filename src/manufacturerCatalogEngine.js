const MANUFACTURER_CATALOG = {
  fans: [
    {
      brand: "Nicotra",
      model: "NICOTRA-BC-2500",
      type: "Backward Curved Plug Fan",
      airflowCMH: 2500,
      pressurePa: 750,
      motorHP: 2,
      efficiency: 70,
      rpm: 1450,
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Comefri",
      model: "COMEFRI-BC-5000",
      type: "Backward Curved Centrifugal Fan",
      airflowCMH: 5000,
      pressurePa: 950,
      motorHP: 5,
      efficiency: 73,
      rpm: 1450,
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Kruger",
      model: "KRUGER-BC-7500",
      type: "Backward Curved Centrifugal Fan",
      airflowCMH: 7500,
      pressurePa: 1100,
      motorHP: 7.5,
      efficiency: 74,
      rpm: 1450,
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Ziehl-Abegg",
      model: "ZA-PLUG-10000",
      type: "EC / Plug Fan",
      airflowCMH: 10000,
      pressurePa: 1200,
      motorHP: 10,
      efficiency: 76,
      rpm: 1450,
      note: "Replace with official datasheet model.",
    },
  ],

  filters: [
    {
      brand: "Camfil",
      model: "CAMFIL-G4-PREFILTER",
      type: "Pre Filter",
      grade: "G4",
      size: "610 × 610 × 50 mm",
      ratedAirflowCMH: 1200,
      initialPressurePa: 45,
      finalPressurePa: 150,
      cost: 1400,
      note: "Replace with official datasheet model.",
    },
    {
      brand: "AAF",
      model: "AAF-F8-FINE-FILTER",
      type: "Fine Filter",
      grade: "F8",
      size: "610 × 610 × 150 mm",
      ratedAirflowCMH: 1000,
      initialPressurePa: 95,
      finalPressurePa: 300,
      cost: 3800,
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Freudenberg",
      model: "FREUDENBERG-H14-HEPA",
      type: "HEPA Filter",
      grade: "H14",
      size: "610 × 610 × 150 mm",
      ratedAirflowCMH: 850,
      initialPressurePa: 220,
      finalPressurePa: 500,
      cost: 9000,
      note: "Replace with official datasheet model.",
    },
  ],

  coils: [
    {
      brand: "Eurocoil",
      model: "EUROCOIL-5TR-6R",
      type: "Chilled Water Cooling Coil",
      capacityTR: 5,
      rows: 6,
      airflowCMH: 5000,
      faceSize: "900 × 750 mm",
      airPressureDropPa: 120,
      waterPressureDropKPa: 30,
      pipeSize: "1.5 inch",
      valveSize: "DN40",
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Daikin",
      model: "DAIKIN-8TR-6R",
      type: "Chilled Water Cooling Coil",
      capacityTR: 8,
      rows: 6,
      airflowCMH: 8000,
      faceSize: "1200 × 900 mm",
      airPressureDropPa: 145,
      waterPressureDropKPa: 38,
      pipeSize: "2 inch",
      valveSize: "DN50",
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Carrier",
      model: "CARRIER-12TR-8R",
      type: "Chilled Water Cooling Coil",
      capacityTR: 12,
      rows: 8,
      airflowCMH: 12000,
      faceSize: "1400 × 1000 mm",
      airPressureDropPa: 170,
      waterPressureDropKPa: 46,
      pipeSize: "2.5 inch",
      valveSize: "DN65",
      note: "Replace with official datasheet model.",
    },
  ],

  pumps: [
    {
      brand: "Grundfos",
      model: "GRUNDFOS-60-15",
      type: "End Suction / Inline Pump",
      flowLPM: 60,
      headM: 15,
      motorHP: 1,
      efficiency: 62,
      rpm: 2900,
      suctionSize: "2 inch",
      dischargeSize: "1.5 inch",
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Wilo",
      model: "WILO-100-20",
      type: "Inline Pump",
      flowLPM: 100,
      headM: 20,
      motorHP: 2,
      efficiency: 66,
      rpm: 2900,
      suctionSize: "2.5 inch",
      dischargeSize: "2 inch",
      note: "Replace with official datasheet model.",
    },
    {
      brand: "KSB",
      model: "KSB-180-25",
      type: "End Suction Pump",
      flowLPM: 180,
      headM: 25,
      motorHP: 3,
      efficiency: 70,
      rpm: 2900,
      suctionSize: "3 inch",
      dischargeSize: "2.5 inch",
      note: "Replace with official datasheet model.",
    },
    {
      brand: "Kirloskar",
      model: "KIRLOSKAR-300-30",
      type: "End Suction Pump",
      flowLPM: 300,
      headM: 30,
      motorHP: 5,
      efficiency: 72,
      rpm: 2900,
      suctionSize: "4 inch",
      dischargeSize: "3 inch",
      note: "Replace with official datasheet model.",
    },
  ],
};

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function nearestGreater(items, requirement, airflowKey, pressureKey) {
  const suitable = items.filter(
    (item) =>
      item[airflowKey] >= requirement.airflow &&
      item[pressureKey] >= requirement.pressure
  );

  return suitable.length > 0
    ? suitable.sort(
        (a, b) =>
          a[airflowKey] +
          a[pressureKey] -
          (b[airflowKey] + b[pressureKey])
      )[0]
    : items[items.length - 1];
}

export function selectManufacturerFan({ airflowCMH = 0, pressurePa = 0 }) {
  const selected = nearestGreater(
    MANUFACTURER_CATALOG.fans,
    {
      airflow: num(airflowCMH),
      pressure: num(pressurePa),
    },
    "airflowCMH",
    "pressurePa"
  );

  return {
    requiredAirflowCMH: num(airflowCMH),
    requiredPressurePa: num(pressurePa),
    selected,
    warning:
      selected.note ||
      "Final fan selection must be verified with official manufacturer fan curve.",
  };
}

export function selectManufacturerFilters({
  airflowCMH = 0,
  cleanroom = true,
}) {
  const stages = cleanroom
    ? MANUFACTURER_CATALOG.filters
    : MANUFACTURER_CATALOG.filters.filter((f) => f.grade !== "H14");

  const selected = stages.map((filter) => {
    const quantity = Math.max(
      1,
      Math.ceil(num(airflowCMH) / filter.ratedAirflowCMH)
    );

    return {
      ...filter,
      quantity,
      totalRatedAirflowCMH: quantity * filter.ratedAirflowCMH,
      totalCost: quantity * filter.cost,
    };
  });

  return {
    requiredAirflowCMH: num(airflowCMH),
    selected,
    totalInitialPressurePa: selected.reduce(
      (sum, f) => sum + f.initialPressurePa,
      0
    ),
    totalFinalPressurePa: selected.reduce(
      (sum, f) => sum + f.finalPressurePa,
      0
    ),
    totalCost: selected.reduce((sum, f) => sum + f.totalCost, 0),
    warning:
      "Final filter selection must be verified with official filter datasheets and HEPA test certificates.",
  };
}

export function selectManufacturerCoil({
  requiredTR = 0,
  airflowCMH = 0,
}) {
  const suitable = MANUFACTURER_CATALOG.coils.filter(
    (coil) =>
      coil.capacityTR >= num(requiredTR) &&
      coil.airflowCMH >= num(airflowCMH)
  );

  const selected =
    suitable.length > 0
      ? suitable.sort(
          (a, b) =>
            a.capacityTR + a.airflowCMH - (b.capacityTR + b.airflowCMH)
        )[0]
      : MANUFACTURER_CATALOG.coils[MANUFACTURER_CATALOG.coils.length - 1];

  return {
    requiredTR: num(requiredTR),
    requiredAirflowCMH: num(airflowCMH),
    selected,
    warning:
      "Final coil selection must be verified with official coil selection software/datasheet.",
  };
}

export function selectManufacturerPump({ flowLPM = 0, headM = 0 }) {
  const suitable = MANUFACTURER_CATALOG.pumps.filter(
    (pump) => pump.flowLPM >= num(flowLPM) && pump.headM >= num(headM)
  );

  const selected =
    suitable.length > 0
      ? suitable.sort(
          (a, b) => a.flowLPM + a.headM - (b.flowLPM + b.headM)
        )[0]
      : MANUFACTURER_CATALOG.pumps[MANUFACTURER_CATALOG.pumps.length - 1];

  return {
    requiredFlowLPM: num(flowLPM),
    requiredHeadM: num(headM),
    selected,
    warning:
      "Final pump selection must be verified with official pump curve and NPSH check.",
  };
}

export function runManufacturerCatalogSelection({
  airflowCMH = 0,
  pressurePa = 0,
  requiredTR = 0,
  pumpFlowLPM = 0,
  pumpHeadM = 0,
  cleanroom = true,
}) {
  return {
    fan: selectManufacturerFan({
      airflowCMH,
      pressurePa,
    }),

    filters: selectManufacturerFilters({
      airflowCMH,
      cleanroom,
    }),

    coil: selectManufacturerCoil({
      requiredTR,
      airflowCMH,
    }),

    pump: selectManufacturerPump({
      flowLPM: pumpFlowLPM,
      headM: pumpHeadM,
    }),
  };
}

export function getManufacturerCatalog() {
  return MANUFACTURER_CATALOG;
}