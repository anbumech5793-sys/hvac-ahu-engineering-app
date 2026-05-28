function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function round(value, digits = 2) {
  return Number(value || 0).toFixed(digits);
}

function equivalentRoundDiameter(areaM2) {
  return Math.sqrt((4 * areaM2) / Math.PI) * 1000;
}

function rectangularDuctSize(areaM2) {
  const aspectRatio = 2;
  const heightM = Math.sqrt(areaM2 / aspectRatio);
  const widthM = heightM * aspectRatio;

  return {
    widthMM: Math.ceil(widthM * 1000 / 25) * 25,
    heightMM: Math.ceil(heightM * 1000 / 25) * 25,
  };
}

function estimateFrictionLossPaPerM(velocity) {
  if (velocity <= 4) return 0.6;
  if (velocity <= 6) return 0.9;
  if (velocity <= 8) return 1.3;
  if (velocity <= 10) return 1.8;
  return 2.5;
}

export function calculateDuctSize({
  airflowCMH = 0,
  velocityMS = 8,
}) {
  const airflowM3S = num(airflowCMH) / 3600;
  const velocity = num(velocityMS, 8);
  const areaM2 = airflowM3S / velocity;

  const roundDiaMM = equivalentRoundDiameter(areaM2);
  const rectangular = rectangularDuctSize(areaM2);

  return {
    airflowCMH: num(airflowCMH),
    velocityMS: velocity,
    areaM2,
    roundDiaMM,
    rectangularWidthMM: rectangular.widthMM,
    rectangularHeightMM: rectangular.heightMM,
  };
}

export function runAutoDuctRoutingEngine({
  rooms = [],
  mainVelocity = 8,
  branchVelocity = 6,
  branchLengthM = 8,
  mainLengthM = 15,
}) {
  const totalAirflowCMH = rooms.reduce(
    (sum, room) => sum + num(room.supplyCMH),
    0
  );

  const mainDuct = calculateDuctSize({
    airflowCMH: totalAirflowCMH,
    velocityMS: mainVelocity,
  });

  const branches = rooms.map((room, index) => {
    const branchDuct = calculateDuctSize({
      airflowCMH: room.supplyCMH,
      velocityMS: branchVelocity,
    });

    const diffuserQty = Math.max(
      1,
      Math.ceil(num(room.supplyCMH) / 600)
    );

    const diffuserAirflowCMH =
      num(room.supplyCMH) / diffuserQty;

    const frictionLoss =
      estimateFrictionLossPaPerM(branchVelocity) *
      branchLengthM;

    const fittingLoss = 35;
    const diffuserLoss = 25;

    const totalBranchLoss =
      frictionLoss + fittingLoss + diffuserLoss;

    return {
      id: room.id || index + 1,
      roomName: room.name || `Room ${index + 1}`,
      roomType: room.type || "Room",
      airflowCMH: num(room.supplyCMH),
      branchDuct,
      diffuserQty,
      diffuserAirflowCMH,
      branchLengthM,
      frictionLossPa: frictionLoss,
      fittingLossPa: fittingLoss,
      diffuserLossPa: diffuserLoss,
      totalBranchLossPa: totalBranchLoss,
      route: {
        startX: 100,
        startY: 300,
        endX: 200 + index * 180,
        endY: 160,
      },
    };
  });

  const mainFrictionLoss =
    estimateFrictionLossPaPerM(mainVelocity) *
    mainLengthM;

  const maxBranchLoss =
    branches.length > 0
      ? Math.max(...branches.map((b) => b.totalBranchLossPa))
      : 0;

  const totalDuctPressurePa =
    mainFrictionLoss + maxBranchLoss + 50;

  const warnings = [];

  if (totalAirflowCMH <= 0) {
    warnings.push("Total airflow is zero. Add rooms or calculate zoning first.");
  }

  branches.forEach((branch) => {
    if (branch.branchDuct.roundDiaMM < 150) {
      warnings.push(
        `${branch.roomName}: Branch duct diameter is very small. Check minimum duct size.`
      );
    }

    if (branch.diffuserAirflowCMH > 700) {
      warnings.push(
        `${branch.roomName}: Diffuser airflow is high. Increase diffuser quantity.`
      );
    }
  });

  if (mainVelocity > 9) {
    warnings.push(
      "Main duct velocity is high. Noise and pressure drop may increase."
    );
  }

  if (branchVelocity > 7) {
    warnings.push(
      "Branch duct velocity is high. Check room noise requirement."
    );
  }

  return {
    totalAirflowCMH,
    mainDuct,
    branches,
    mainLengthM,
    branchLengthM,
    mainFrictionLossPa: mainFrictionLoss,
    totalDuctPressurePa,
    warnings,
  };
}