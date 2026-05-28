export const catalogDatabase = {
  fans: [
    { model: "AG-FAN-2500-850", airflow: 2500, pressure: 850, powerKW: 1.5, motorHP: 2 },
    { model: "AG-FAN-5000-900", airflow: 5000, pressure: 900, powerKW: 3.7, motorHP: 5 },
    { model: "AG-FAN-7500-1000", airflow: 7500, pressure: 1000, powerKW: 5.5, motorHP: 7.5 },
  ],

  motors: [
    { model: "IEC-90L", hp: 2, kw: 1.5, rpm: 1440 },
    { model: "IEC-112M", hp: 5, kw: 3.7, rpm: 1440 },
    { model: "IEC-132S", hp: 7.5, kw: 5.5, rpm: 1440 },
  ],

  filters: [
    { type: "Pre Filter", grade: "G4", size: "610x610x50", airflow: 1000 },
    { type: "Fine Filter", grade: "F8", size: "610x610x150", airflow: 1200 },
    { type: "HEPA", grade: "H14", size: "610x610x150", airflow: 1000 },
  ],

  coils: [
    { model: "AG-COIL-2TR", tr: 2, rows: 4, airflow: 2500 },
    { model: "AG-COIL-5TR", tr: 5, rows: 6, airflow: 5000 },
    { model: "AG-COIL-8TR", tr: 8, rows: 8, airflow: 8000 },
  ],
};

export function selectFan(airflow, pressure) {
  return (
    catalogDatabase.fans.find(
      (fan) => fan.airflow >= airflow && fan.pressure >= pressure
    ) || catalogDatabase.fans[catalogDatabase.fans.length - 1]
  );
}

export function selectMotor(requiredHP) {
  return (
    catalogDatabase.motors.find((motor) => motor.hp >= requiredHP) ||
    catalogDatabase.motors[catalogDatabase.motors.length - 1]
  );
}

export function selectFilters(airflow) {
  const hepaQty = Math.ceil(airflow / 1000);

  return {
    preFilter: catalogDatabase.filters[0],
    fineFilter: catalogDatabase.filters[1],
    hepaFilter: catalogDatabase.filters[2],
    hepaQty,
  };
}

export function selectCoil(requiredTR) {
  return (
    catalogDatabase.coils.find((coil) => coil.tr >= requiredTR) ||
    catalogDatabase.coils[catalogDatabase.coils.length - 1]
  );
}

export function runCatalogSelection({ airflow, pressure, fanHP, coilTR }) {
  const selectedFan = selectFan(airflow, pressure);
  const selectedMotor = selectMotor(fanHP);
  const selectedFilters = selectFilters(airflow);
  const selectedCoil = selectCoil(coilTR);

  return {
    selectedFan,
    selectedMotor,
    selectedFilters,
    selectedCoil,
  };
}