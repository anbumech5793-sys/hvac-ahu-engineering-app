function num(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function calculateRecoveryTime({
  initialParticleCount = 3520000,
  finalParticleCount = 352000,
  ach = 25,
}) {
  const c0 = num(initialParticleCount, 3520000);
  const ct = num(finalParticleCount, 352000);
  const airChanges = num(ach, 25);

  if (c0 <= 0 || ct <= 0 || ct >= c0 || airChanges <= 0) {
    return {
      valid: false,
      recoveryMinutes: null,
      message:
        "Invalid recovery inputs. Initial count must be higher than final count and ACH must be greater than zero.",
    };
  }

  const recoveryMinutes =
    (-Math.log(ct / c0) / airChanges) * 60;

  return {
    valid: true,
    initialParticleCount: c0,
    finalParticleCount: ct,
    ach: airChanges,
    recoveryMinutes,
  };
}

export function getISOClassLimit(isoClass) {
  const key = String(isoClass || "").toUpperCase();

  if (key.includes("ISO 5")) return 3520;
  if (key.includes("ISO 6")) return 35200;
  if (key.includes("ISO 7")) return 352000;
  if (key.includes("ISO 8")) return 3520000;

  return null;
}

export function checkParticleCompliance({
  measuredParticleCount = 0,
  isoClass = "ISO 8",
}) {
  const limit = getISOClassLimit(isoClass);

  if (!limit) {
    return {
      valid: false,
      compliant: false,
      message:
        "ISO particle limit not available for selected class.",
    };
  }

  const measured = num(measuredParticleCount, 0);

  return {
    valid: true,
    isoClass,
    measuredParticleCount: measured,
    limit,
    compliant: measured <= limit,
    message:
      measured <= limit
        ? "Particle count is within selected ISO class limit."
        : "Particle count exceeds selected ISO class limit.",
  };
}

export function estimateCleanroomRecovery({
  isoClass = "ISO 8",
  ach = 25,
  currentParticleCount,
}) {
  const targetLimit = getISOClassLimit(isoClass);

  const initial =
    num(currentParticleCount, targetLimit ? targetLimit * 10 : 3520000);

  const final =
    targetLimit || 3520000;

  const recovery = calculateRecoveryTime({
    initialParticleCount: initial,
    finalParticleCount: final,
    ach,
  });

  return {
    isoClass,
    targetParticleLimit: final,
    recovery,
  };
}

export function runRecoveryMasterEngine({
  isoClass = "ISO 8",
  ach = 25,
  currentParticleCount,
  measuredParticleCount,
}) {
  const recoveryEstimate =
    estimateCleanroomRecovery({
      isoClass,
      ach,
      currentParticleCount,
    });

  const compliance =
    checkParticleCompliance({
      isoClass,
      measuredParticleCount:
        measuredParticleCount ||
        recoveryEstimate.targetParticleLimit,
    });

  const warnings = [];

  if (ach < 15) {
    warnings.push(
      "ACH is low for most classified cleanroom applications. Review cleanroom class and recovery requirement."
    );
  }

  if (
    recoveryEstimate.recovery.valid &&
    recoveryEstimate.recovery.recoveryMinutes > 20
  ) {
    warnings.push(
      "Estimated recovery time is high. Increase airflow/ACH or improve filtration strategy."
    );
  }

  if (!compliance.compliant) {
    warnings.push(
      "Measured particle count exceeds target ISO class limit."
    );
  }

  warnings.push(
    "Final cleanroom compliance must be verified by ISO 14644 particle testing and qualification."
  );

  return {
    recoveryEstimate,
    compliance,
    warnings,
  };
}