export function calculateEngineeringSystem(components) {

  let totalLength = 0;

  let airflow = 5000; // CMH initial

  let pressureDrop = 0;

  components.forEach((c) => {

    totalLength += Number(c.w || 0);

    if (c.type === "Filter") {
      pressureDrop += 120;
    }

    if (c.type === "Coil") {
      pressureDrop += 180;
    }

    if (c.type === "Fan") {
      pressureDrop += 250;
    }

    if (c.type === "Damper") {
      pressureDrop += 80;
    }

    if (c.type === "Motor") {
      pressureDrop += 20;
    }

  });

  const faceArea =
    (800 * 800) / 1000000;

  const faceVelocity =
    airflow / 3600 / faceArea;

  const fanKW =
    ((airflow / 3600) * pressureDrop) /
    1000;

  const motorHP =
    fanKW / 0.746;

  return {

    airflow,

    pressureDrop,

    faceVelocity,

    fanKW,

    motorHP,

    totalLength,

  };
}