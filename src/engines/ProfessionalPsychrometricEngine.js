export function runProfessionalPsychrometricEngine(data) {
  const dbt = Number(data.dryBulbTemp);
  const rh = Number(data.relativeHumidity);
  const pressure = Number(data.atmosphericPressure);

  // Saturation pressure (kPa)
  const pws =
    0.61078 *
    Math.exp((17.2694 * dbt) / (dbt + 237.3));

  // Partial vapor pressure
  const pw = (rh / 100) * pws;

  // Humidity ratio
  const humidityRatio =
    0.62198 * pw / (pressure - pw);

  // Enthalpy
  const enthalpy =
    1.006 * dbt +
    humidityRatio * (2501 + 1.86 * dbt);

  // Dew point
  const alpha =
    Math.log(pw / 0.61078);

  const dewPoint =
    (237.3 * alpha) /
    (17.2694 - alpha);

  // Wet bulb approximation
  const wetBulb =
    dbt *
      Math.atan(
        0.151977 *
          Math.sqrt(rh + 8.313659)
      ) +
    Math.atan(dbt + rh) -
    Math.atan(rh - 1.676331) +
    0.00391838 *
      Math.pow(rh, 1.5) *
      Math.atan(0.023101 * rh) -
    4.686035;

  // Specific volume
  const specificVolume =
    (0.287042 *
      (dbt + 273.15) *
      (1 + 1.607858 * humidityRatio)) /
    pressure;

  // Air density
  const airDensity =
    1 / specificVolume;

  // Apparatus dew point approximation
  const adp = dbt - 8;

  // SHF
  const shf = 0.75;

  // RSHF
  const rshf = 0.80;

  // GSHF
  const gshf = 0.72;

  return {
    dryBulbTemp: dbt.toFixed(2),
    wetBulbTemp: wetBulb.toFixed(2),
    relativeHumidity: rh.toFixed(2),

    saturationPressure: pws.toFixed(4),
    vaporPressure: pw.toFixed(4),

    humidityRatio:
      (humidityRatio * 1000).toFixed(2),

    enthalpy: enthalpy.toFixed(2),

    dewPoint: dewPoint.toFixed(2),

    specificVolume:
      specificVolume.toFixed(3),

    airDensity:
      airDensity.toFixed(3),

    apparatusDewPoint:
      adp.toFixed(2),

    sensibleHeatFactor:
      shf.toFixed(2),

    roomSHF:
      rshf.toFixed(2),

    grandSHF:
      gshf.toFixed(2),
  };
}