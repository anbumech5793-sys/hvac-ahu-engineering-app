const PUMP_CATALOG = [
  {
    model: "AG-PUMP-30-10",
    type: "End Suction Centrifugal Pump",
    flowLPM: 30,
    headM: 10,
    motorHP: 0.5,
    efficiency: 58,
    rpm: 2900,
    suctionSize: "1.5 inch",
    dischargeSize: "1 inch",
    noiseDB: 62,
  },
  {
    model: "AG-PUMP-60-15",
    type: "End Suction Centrifugal Pump",
    flowLPM: 60,
    headM: 15,
    motorHP: 1,
    efficiency: 62,
    rpm: 2900,
    suctionSize: "2 inch",
    dischargeSize: "1.5 inch",
    noiseDB: 66,
  },
  {
    model: "AG-PUMP-100-20",
    type: "End Suction Centrifugal Pump",
    flowLPM: 100,
    headM: 20,
    motorHP: 2,
    efficiency: 66,
    rpm: 2900,
    suctionSize: "2.5 inch",
    dischargeSize: "2 inch",
    noiseDB: 70,
  },
  {
    model: "AG-PUMP-180-25",
    type: "End Suction Centrifugal Pump",
    flowLPM: 180,
    headM: 25,
    motorHP: 3,
    efficiency: 70,
    rpm: 2900,
    suctionSize: "3 inch",
    dischargeSize: "2.5 inch",
    noiseDB: 74,
  },
  {
    model: "AG-PUMP-300-30",
    type: "End Suction Centrifugal Pump",
    flowLPM: 300,
    headM: 30,
    motorHP: 5,
    efficiency: 72,
    rpm: 2900,
    suctionSize: "4 inch",
    dischargeSize: "3 inch",
    noiseDB: 78,
  },
  {
    model: "AG-PUMP-500-35",
    type: "End Suction Centrifugal Pump",
    flowLPM: 500,
    headM: 35,
    motorHP: 7.5,
    efficiency: 74,
    rpm: 2900,
    suctionSize: "5 inch",
    dischargeSize: "4 inch",
    noiseDB: 82,
  },
];

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function calculatePumpPower({
  flowLPM = 0,
  headM = 0,
  efficiency = 65,
}) {
  const flowM3S = num(flowLPM) / 1000 / 60;
  const head = num(headM);
  const eff = num(efficiency, 65) / 100;

  const density = 1000;
  const gravity = 9.81;

  const kw =
    (density * gravity * flowM3S * head) /
    (1000 * eff);

  const hp = kw / 0.746;

  return {
    kw: Number(round(kw, 2)),
    hp: Number(round(hp, 2)),
  };
}

function selectStandardMotorHP(requiredHP) {
  const hpList = [
    0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25,
  ];

  return hpList.find((hp) => hp >= requiredHP) || hpList[hpList.length - 1];
}

export function selectPumpFromCatalog({
  flowLPM = 0,
  headM = 0,
}) {
  const requiredFlow = num(flowLPM);
  const requiredHead = num(headM);

  const suitablePumps = PUMP_CATALOG.filter(
    (pump) =>
      pump.flowLPM >= requiredFlow &&
      pump.headM >= requiredHead
  );

  const selectedPump =
    suitablePumps.length > 0
      ? suitablePumps.sort(
          (a, b) =>
            a.flowLPM +
            a.headM -
            (b.flowLPM + b.headM)
        )[0]
      : PUMP_CATALOG[PUMP_CATALOG.length - 1];

  const calculatedPower =
    calculatePumpPower({
      flowLPM: requiredFlow,
      headM: requiredHead,
      efficiency: selectedPump.efficiency,
    });

  const selectedMotorHP =
    selectStandardMotorHP(calculatedPower.hp);

  const flowUtilization =
    requiredFlow / selectedPump.flowLPM;

  const headUtilization =
    requiredHead / selectedPump.headM;

  const warnings = [];

  if (suitablePumps.length === 0) {
    warnings.push(
      "Required flow/head is above available pump catalog. Select larger or custom pump."
    );
  }

  if (flowUtilization < 0.4) {
    warnings.push(
      "Selected pump flow capacity is much higher than requirement. Check smaller pump or use balancing valve/VFD."
    );
  }

  if (headUtilization > 0.95) {
    warnings.push(
      "Required head is close to pump maximum. Add safety margin or select higher head pump."
    );
  }

  if (selectedMotorHP > selectedPump.motorHP) {
    warnings.push(
      "Calculated motor HP is higher than catalog motor HP. Select higher motor rating."
    );
  }

  return {
    required: {
      flowLPM: requiredFlow,
      headM: requiredHead,
      calculatedKW: calculatedPower.kw,
      calculatedHP: calculatedPower.hp,
      selectedMotorHP,
    },
    selectedPump,
    utilization: {
      flowPercent: Number(round(flowUtilization * 100, 1)),
      headPercent: Number(round(headUtilization * 100, 1)),
    },
    warnings,
    pumpCurve: [
      {
        flow: 0,
        head: selectedPump.headM * 1.2,
      },
      {
        flow: selectedPump.flowLPM * 0.5,
        head: selectedPump.headM * 1.1,
      },
      {
        flow: selectedPump.flowLPM,
        head: selectedPump.headM,
      },
      {
        flow: selectedPump.flowLPM * 1.2,
        head: selectedPump.headM * 0.75,
      },
    ],
    dutyPoint: [
      {
        flow: requiredFlow,
        head: requiredHead,
      },
    ],
  };
}

export function getPumpCatalog() {
  return PUMP_CATALOG;
}