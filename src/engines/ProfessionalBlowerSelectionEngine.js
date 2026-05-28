export function runProfessionalBlowerSelectionEngine(data) {
  const airFlowCFM = Number(data.airFlowCFM);

  const filterPD = Number(data.filterPD);
  const coilPD = Number(data.coilPD);
  const ductPD = Number(data.ductPD);
  const diffuserPD = Number(data.diffuserPD);

  const fanEfficiency = Number(data.fanEfficiency);
  const motorEfficiency = Number(data.motorEfficiency);

  const rpm = Number(data.rpm);

  const outletArea = Number(data.outletArea);

  // Airflow conversion
  const airFlowM3s =
    airFlowCFM * 0.000471947;

  // Total static pressure
  const totalStaticPressure =
    filterPD +
    coilPD +
    ductPD +
    diffuserPD;

  // Air power
  const airPower =
    airFlowM3s *
    totalStaticPressure;

  // Shaft power
  const shaftPower =
    airPower /
    (fanEfficiency / 100);

  // Motor power
  const motorPower =
    shaftPower /
    (motorEfficiency / 100);

  // Convert to kW
  const motorPowerKW =
    motorPower / 1000;

  // Convert to HP
  const motorPowerHP =
    motorPowerKW * 1.341;

  // Outlet velocity
  const outletVelocity =
    airFlowM3s / outletArea;

  // Fan laws
  const fanLawPressure =
    Math.pow(rpm / 1000, 2);

  const fanLawPower =
    Math.pow(rpm / 1000, 3);

  // Fan class selection
  let fanClass = "Class I";

  if (totalStaticPressure > 1000)
    fanClass = "Class II";

  if (totalStaticPressure > 2000)
    fanClass = "Class III";

  // Drive type
  let driveType = "Direct Drive";

  if (motorPowerKW > 7.5)
    driveType = "Belt Drive";

  // Brake horsepower
  const brakeHP =
    shaftPower / 746;

  // System resistance coefficient
  const systemResistance =
    totalStaticPressure /
    Math.pow(airFlowM3s, 2);

  return {
    airFlowM3s:
      airFlowM3s.toFixed(3),

    totalStaticPressure:
      totalStaticPressure.toFixed(2),

    airPower:
      airPower.toFixed(2),

    shaftPower:
      shaftPower.toFixed(2),

    motorPowerKW:
      motorPowerKW.toFixed(2),

    motorPowerHP:
      motorPowerHP.toFixed(2),

    brakeHorsePower:
      brakeHP.toFixed(2),

    outletVelocity:
      outletVelocity.toFixed(2),

    fanLawPressure:
      fanLawPressure.toFixed(3),

    fanLawPower:
      fanLawPower.toFixed(3),

    systemResistance:
      systemResistance.toFixed(3),

    fanClass,

    driveType,
  };
}