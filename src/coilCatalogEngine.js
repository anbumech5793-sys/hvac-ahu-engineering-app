const COIL_CATALOG = [
  {
    model: "AG-COIL-2TR-4R",
    capacityTR: 2,
    rows: 4,
    airflowCMH: 2500,
    faceWidthMM: 600,
    faceHeightMM: 600,
    airPressureDropPa: 85,
    waterPressureDropKPa: 22,
    pipeSize: "1 inch",
    valveSize: "DN25",
  },
  {
    model: "AG-COIL-5TR-6R",
    capacityTR: 5,
    rows: 6,
    airflowCMH: 5000,
    faceWidthMM: 900,
    faceHeightMM: 750,
    airPressureDropPa: 120,
    waterPressureDropKPa: 30,
    pipeSize: "1.5 inch",
    valveSize: "DN40",
  },
  {
    model: "AG-COIL-8TR-6R",
    capacityTR: 8,
    rows: 6,
    airflowCMH: 8000,
    faceWidthMM: 1200,
    faceHeightMM: 900,
    airPressureDropPa: 145,
    waterPressureDropKPa: 38,
    pipeSize: "2 inch",
    valveSize: "DN50",
  },
  {
    model: "AG-COIL-12TR-8R",
    capacityTR: 12,
    rows: 8,
    airflowCMH: 12000,
    faceWidthMM: 1400,
    faceHeightMM: 1000,
    airPressureDropPa: 170,
    waterPressureDropKPa: 46,
    pipeSize: "2.5 inch",
    valveSize: "DN65",
  },
  {
    model: "AG-COIL-18TR-8R",
    capacityTR: 18,
    rows: 8,
    airflowCMH: 18000,
    faceWidthMM: 1600,
    faceHeightMM: 1200,
    airPressureDropPa: 190,
    waterPressureDropKPa: 55,
    pipeSize: "3 inch",
    valveSize: "DN80",
  },
  {
    model: "AG-COIL-25TR-10R",
    capacityTR: 25,
    rows: 10,
    airflowCMH: 25000,
    faceWidthMM: 1800,
    faceHeightMM: 1400,
    airPressureDropPa: 220,
    waterPressureDropKPa: 68,
    pipeSize: "4 inch",
    valveSize: "DN100",
  },
];

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function selectStandardPumpHead(totalHeadM) {
  const headList = [8, 10, 12, 15, 18, 22, 25, 30, 35, 40];

  return headList.find((head) => head >= totalHeadM) || headList[headList.length - 1];
}

function selectPipeSizeByFlow(lpm) {
  const flow = num(lpm);

  if (flow <= 20) return { pipeSize: "1 inch", valveSize: "DN25" };
  if (flow <= 45) return { pipeSize: "1.5 inch", valveSize: "DN40" };
  if (flow <= 75) return { pipeSize: "2 inch", valveSize: "DN50" };
  if (flow <= 120) return { pipeSize: "2.5 inch", valveSize: "DN65" };
  if (flow <= 180) return { pipeSize: "3 inch", valveSize: "DN80" };
  return { pipeSize: "4 inch", valveSize: "DN100" };
}

function calculateCHWFlowLPM(capacityTR, deltaT = 5) {
  const kw = capacityTR * 3.517;
  const flowKgS = kw / (4.186 * deltaT);
  return flowKgS * 60;
}

function estimatePipeHeadLossM({
  flowLPM,
  pipeLengthM = 30,
}) {
  const flow = num(flowLPM);
  const length = num(pipeLengthM, 30);

  let lossPer10M = 0.8;

  if (flow > 40) lossPer10M = 1.1;
  if (flow > 80) lossPer10M = 1.5;
  if (flow > 150) lossPer10M = 2.0;

  return (lossPer10M * length) / 10;
}

export function selectCoolingCoil({
  requiredTR = 0,
  airflowCMH = 0,
  chwDeltaT = 5,
  pipeLengthM = 30,
}) {
  const tr = num(requiredTR);
  const airflow = num(airflowCMH);

  const suitableCoils = COIL_CATALOG.filter(
    (coil) =>
      coil.capacityTR >= tr &&
      coil.airflowCMH >= airflow
  );

  const selectedCoil =
    suitableCoils.length > 0
      ? suitableCoils.sort(
          (a, b) =>
            a.capacityTR + a.airflowCMH -
            (b.capacityTR + b.airflowCMH)
        )[0]
      : COIL_CATALOG[COIL_CATALOG.length - 1];

  const chwFlowLPM = calculateCHWFlowLPM(
    selectedCoil.capacityTR,
    chwDeltaT
  );

  const pipeSelection = selectPipeSizeByFlow(chwFlowLPM);

  const pipeHeadLossM = estimatePipeHeadLossM({
    flowLPM: chwFlowLPM,
    pipeLengthM,
  });

  const coilWaterHeadM =
    selectedCoil.waterPressureDropKPa / 9.81;

  const valveHeadM = 2.5;
  const fittingsHeadM = 3;
  const safetyHeadM = 2;

  const totalPumpHeadM =
    pipeHeadLossM +
    coilWaterHeadM +
    valveHeadM +
    fittingsHeadM +
    safetyHeadM;

  const selectedPumpHeadM =
    selectStandardPumpHead(totalPumpHeadM);

  const utilizationTR =
    tr / selectedCoil.capacityTR;

  const utilizationAirflow =
    airflow / selectedCoil.airflowCMH;

  const warnings = [];

  if (suitableCoils.length === 0) {
    warnings.push(
      "Required TR or airflow is above available coil catalog. Select custom coil."
    );
  }

  if (utilizationTR < 0.45) {
    warnings.push(
      "Selected coil capacity is much higher than required. Check smaller coil option."
    );
  }

  if (utilizationAirflow > 0.95) {
    warnings.push(
      "Airflow is close to selected coil maximum. Check face velocity and air pressure drop."
    );
  }

  if (selectedCoil.airPressureDropPa > 200) {
    warnings.push(
      "Coil air pressure drop is high. Fan pressure must include coil PD."
    );
  }

  if (totalPumpHeadM > 25) {
    warnings.push(
      "Pump head is high. Check pipe routing length and fittings."
    );
  }

  return {
    required: {
      requiredTR: tr,
      airflowCMH: airflow,
      chwDeltaT,
      pipeLengthM,
    },
    selectedCoil,
    chilledWater: {
      flowLPM: Number(round(chwFlowLPM, 2)),
      pipeSize: pipeSelection.pipeSize,
      valveSize: pipeSelection.valveSize,
      pipeHeadLossM: Number(round(pipeHeadLossM, 2)),
      coilWaterHeadM: Number(round(coilWaterHeadM, 2)),
      valveHeadM,
      fittingsHeadM,
      safetyHeadM,
      totalPumpHeadM: Number(round(totalPumpHeadM, 2)),
      selectedPumpHeadM,
    },
    utilization: {
      capacityPercent: Number(round(utilizationTR * 100, 1)),
      airflowPercent: Number(round(utilizationAirflow * 100, 1)),
    },
    warnings,
    coilPerformanceChart: [
      {
        loadPercent: 25,
        capacityTR: selectedCoil.capacityTR * 0.25,
      },
      {
        loadPercent: 50,
        capacityTR: selectedCoil.capacityTR * 0.5,
      },
      {
        loadPercent: 75,
        capacityTR: selectedCoil.capacityTR * 0.75,
      },
      {
        loadPercent: 100,
        capacityTR: selectedCoil.capacityTR,
      },
    ],
    pumpHeadChart: [
      {
        item: "Pipe",
        head: Number(round(pipeHeadLossM, 2)),
      },
      {
        item: "Coil",
        head: Number(round(coilWaterHeadM, 2)),
      },
      {
        item: "Valve",
        head: valveHeadM,
      },
      {
        item: "Fittings",
        head: fittingsHeadM,
      },
      {
        item: "Safety",
        head: safetyHeadM,
      },
    ],
  };
}

export function getCoilCatalog() {
  return COIL_CATALOG;
}