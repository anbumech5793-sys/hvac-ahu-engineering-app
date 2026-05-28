export function calculateBlowerSelection(input) {
  const {
    airFlowCFM,
    totalStaticPressureMMWC,
    fanEfficiency,
    motorEfficiency,
    driveEfficiency,
    safetyFactor,
  } = input;

  const errors = [];

  if (!airFlowCFM || airFlowCFM <= 0) {
    errors.push("Air flow must be greater than 0 CFM.");
  }

  if (!totalStaticPressureMMWC || totalStaticPressureMMWC <= 0) {
    errors.push("Total static pressure must be greater than 0 mmWC.");
  }

  if (!fanEfficiency || fanEfficiency <= 0 || fanEfficiency > 100) {
    errors.push("Fan efficiency must be between 1 and 100%.");
  }

  if (!motorEfficiency || motorEfficiency <= 0 || motorEfficiency > 100) {
    errors.push("Motor efficiency must be between 1 and 100%.");
  }

  if (!driveEfficiency || driveEfficiency <= 0 || driveEfficiency > 100) {
    errors.push("Drive efficiency must be between 1 and 100%.");
  }

  if (!safetyFactor || safetyFactor < 1) {
    errors.push("Safety factor must be minimum 1.0.");
  }

  if (errors.length > 0) {
    return { errors };
  }

  const cfmToM3s = 0.00047194745;
  const mmwcToPa = 9.80665;

  const airFlowM3s = airFlowCFM * cfmToM3s;
  const totalStaticPressurePa = totalStaticPressureMMWC * mmwcToPa;

  const fanEff = fanEfficiency / 100;
  const motorEff = motorEfficiency / 100;
  const driveEff = driveEfficiency / 100;

  const airPowerKW = (airFlowM3s * totalStaticPressurePa) / 1000;
  const shaftPowerKW = airPowerKW / fanEff;
  const motorInputKW = shaftPowerKW / (motorEff * driveEff);
  const requiredMotorKW = motorInputKW * safetyFactor;
  const requiredMotorHP = requiredMotorKW / 0.746;

  return {
    airFlowM3s: round(airFlowM3s),
    totalStaticPressurePa: round(totalStaticPressurePa),
    airPowerKW: round(airPowerKW),
    shaftPowerKW: round(shaftPowerKW),
    motorInputKW: round(motorInputKW),
    requiredMotorKW: round(requiredMotorKW),
    requiredMotorHP: round(requiredMotorHP),
    errors: [],
  };
}

function round(value) {
  return Number(value.toFixed(2));
}