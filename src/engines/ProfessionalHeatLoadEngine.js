export function runProfessionalHeatLoadEngine(data) {
  const roomLength = Number(data.roomLength);
  const roomWidth = Number(data.roomWidth);
  const roomHeight = Number(data.roomHeight);

  const peopleCount = Number(data.peopleCount);
  const lightingLoad = Number(data.lightingLoad);
  const equipmentLoad = Number(data.equipmentLoad);
  const freshAirCFM = Number(data.freshAirCFM);

  const wallU = Number(data.wallU);
  const roofU = Number(data.roofU);
  const glassU = Number(data.glassU);

  const wallArea = Number(data.wallArea);
  const roofArea = Number(data.roofArea);
  const glassArea = Number(data.glassArea);

  const deltaT = Number(data.deltaT);
  const solarFactor = Number(data.solarFactor);

  // Room volume
  const roomVolume = roomLength * roomWidth * roomHeight;

  // Occupancy load
  const peopleSensible = peopleCount * 75;
  const peopleLatent = peopleCount * 55;

  // Lighting load
  const lightingHeat = lightingLoad;

  // Equipment load
  const equipmentHeat = equipmentLoad;

  // Wall heat gain
  const wallHeat = wallU * wallArea * deltaT;

  // Roof heat gain
  const roofHeat = roofU * roofArea * deltaT;

  // Glass transmission load
  const glassTransmission = glassU * glassArea * deltaT;

  // Solar heat gain
  const solarHeatGain = glassArea * solarFactor;

  // Fresh air sensible
  const freshAirSensible = 1.08 * freshAirCFM * deltaT;

  // Fresh air latent
  const freshAirLatent = 0.68 * freshAirCFM * 20;

  // Total sensible heat
  const totalSensible =
    peopleSensible +
    lightingHeat +
    equipmentHeat +
    wallHeat +
    roofHeat +
    glassTransmission +
    solarHeatGain +
    freshAirSensible;

  // Total latent heat
  const totalLatent =
    peopleLatent +
    freshAirLatent;

  // Grand total heat
  const grandTotalHeat = totalSensible + totalLatent;

  // Convert to TR
  const totalTR = grandTotalHeat / 3517;

  // Safety factor
  const safetyTR = totalTR * 1.1;

  // Supply airflow
  const supplyCFM = safetyTR * 400;

  // SHR
  const SHR = totalSensible / grandTotalHeat;

  return {
    roomVolume: roomVolume.toFixed(2),

    peopleSensible: peopleSensible.toFixed(2),
    peopleLatent: peopleLatent.toFixed(2),

    lightingHeat: lightingHeat.toFixed(2),
    equipmentHeat: equipmentHeat.toFixed(2),

    wallHeat: wallHeat.toFixed(2),
    roofHeat: roofHeat.toFixed(2),

    glassTransmission: glassTransmission.toFixed(2),
    solarHeatGain: solarHeatGain.toFixed(2),

    freshAirSensible: freshAirSensible.toFixed(2),
    freshAirLatent: freshAirLatent.toFixed(2),

    totalSensible: totalSensible.toFixed(2),
    totalLatent: totalLatent.toFixed(2),

    grandTotalHeat: grandTotalHeat.toFixed(2),

    totalTR: totalTR.toFixed(2),
    safetyTR: safetyTR.toFixed(2),

    supplyCFM: supplyCFM.toFixed(2),

    SHR: SHR.toFixed(3),
  };
}