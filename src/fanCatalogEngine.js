const FAN_CATALOG = [
  {
    model: "AG-SISW-2500-700",
    type: "SISW Backward Curved",
    airflowCMH: 2500,
    pressurePa: 700,
    rpm: 1440,
    motorHP: 2,
    efficiency: 68,
    impellerDiaMM: 315,
    noiseDB: 72,
  },
  {
    model: "AG-SISW-3500-850",
    type: "SISW Backward Curved",
    airflowCMH: 3500,
    pressurePa: 850,
    rpm: 1440,
    motorHP: 3,
    efficiency: 70,
    impellerDiaMM: 400,
    noiseDB: 75,
  },
  {
    model: "AG-SISW-5000-950",
    type: "SISW Backward Curved",
    airflowCMH: 5000,
    pressurePa: 950,
    rpm: 1440,
    motorHP: 5,
    efficiency: 72,
    impellerDiaMM: 500,
    noiseDB: 78,
  },
  {
    model: "AG-SISW-7500-1100",
    type: "SISW Backward Curved",
    airflowCMH: 7500,
    pressurePa: 1100,
    rpm: 1440,
    motorHP: 7.5,
    efficiency: 73,
    impellerDiaMM: 560,
    noiseDB: 82,
  },
  {
    model: "AG-DIDW-10000-1200",
    type: "DIDW Backward Curved",
    airflowCMH: 10000,
    pressurePa: 1200,
    rpm: 960,
    motorHP: 10,
    efficiency: 75,
    impellerDiaMM: 630,
    noiseDB: 84,
  },
  {
    model: "AG-DIDW-15000-1400",
    type: "DIDW Backward Curved",
    airflowCMH: 15000,
    pressurePa: 1400,
    rpm: 960,
    motorHP: 15,
    efficiency: 76,
    impellerDiaMM: 710,
    noiseDB: 87,
  },
];

function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function selectStandardMotorHP(requiredHP) {
  const hpList = [
    0.5, 1, 1.5, 2, 3, 5, 7.5, 10, 15, 20, 25, 30, 40, 50,
  ];

  return hpList.find((hp) => hp >= requiredHP) || hpList[hpList.length - 1];
}

function calculateRequiredFanPower({
  airflowCMH,
  pressurePa,
  efficiency = 70,
}) {
  const airflowM3S = num(airflowCMH) / 3600;
  const pressure = num(pressurePa);
  const eff = num(efficiency, 70) / 100;

  const kw = (airflowM3S * pressure) / (1000 * eff);
  const hp = kw / 0.746;

  return {
    kw: Number(round(kw, 2)),
    hp: Number(round(hp, 2)),
    selectedMotorHP: selectStandardMotorHP(hp),
  };
}

export function selectFanFromCatalog({
  airflowCMH = 0,
  pressurePa = 0,
}) {
  const requiredAirflow = num(airflowCMH);
  const requiredPressure = num(pressurePa);

  const suitableFans = FAN_CATALOG.filter(
    (fan) =>
      fan.airflowCMH >= requiredAirflow &&
      fan.pressurePa >= requiredPressure
  );

  const selectedFan =
    suitableFans.length > 0
      ? suitableFans.sort(
          (a, b) =>
            a.airflowCMH +
            a.pressurePa -
            (b.airflowCMH + b.pressurePa)
        )[0]
      : FAN_CATALOG[FAN_CATALOG.length - 1];

  const requiredPower = calculateRequiredFanPower({
    airflowCMH: requiredAirflow,
    pressurePa: requiredPressure,
    efficiency: selectedFan.efficiency,
  });

  const airflowUtilization =
    requiredAirflow / selectedFan.airflowCMH;

  const pressureUtilization =
    requiredPressure / selectedFan.pressurePa;

  const warnings = [];

  if (suitableFans.length === 0) {
    warnings.push(
      "Required duty is above available fan catalog. Select larger custom fan."
    );
  }

  if (airflowUtilization < 0.45) {
    warnings.push(
      "Selected fan is much larger than required airflow. Check smaller model or VFD control."
    );
  }

  if (pressureUtilization > 0.95) {
    warnings.push(
      "Fan pressure is close to maximum catalog pressure. Add safety margin."
    );
  }

  if (requiredPower.selectedMotorHP > selectedFan.motorHP) {
    warnings.push(
      "Calculated motor HP is higher than catalog motor HP. Select higher motor."
    );
  }

  return {
    required: {
      airflowCMH: requiredAirflow,
      pressurePa: requiredPressure,
      calculatedKW: requiredPower.kw,
      calculatedHP: requiredPower.hp,
      selectedMotorHP: requiredPower.selectedMotorHP,
    },
    selectedFan,
    utilization: {
      airflowPercent: Number(round(airflowUtilization * 100, 1)),
      pressurePercent: Number(round(pressureUtilization * 100, 1)),
    },
    warnings,
    fanCurve: [
      {
        airflow: 0,
        pressure: selectedFan.pressurePa * 1.2,
      },
      {
        airflow: selectedFan.airflowCMH * 0.5,
        pressure: selectedFan.pressurePa * 1.1,
      },
      {
        airflow: selectedFan.airflowCMH,
        pressure: selectedFan.pressurePa,
      },
      {
        airflow: selectedFan.airflowCMH * 1.2,
        pressure: selectedFan.pressurePa * 0.75,
      },
    ],
    dutyPoint: [
      {
        airflow: requiredAirflow,
        pressure: requiredPressure,
      },
    ],
  };
}

export function getFanCatalog() {
  return FAN_CATALOG;
}