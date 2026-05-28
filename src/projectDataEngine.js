import { runAutoDesignEngine } from "./autoDesignEngine";
import { runASHRAEMasterEngine } from "./ashraeMasterEngine";
import { runAutoDuctRoutingEngine } from "./autoDuctRoutingEngine";
import { calculatePressureLoss } from "./pressureLossEngine";
import { selectFanFromCatalog } from "./fanCatalogEngine";
import { selectFilterSet } from "./filterCatalogEngine";
import { selectCoolingCoil } from "./coilCatalogEngine";
import { selectPumpFromCatalog } from "./pumpCatalogEngine";

export function runCompleteProjectDesign(input = {}) {
  const autoDesign = runAutoDesignEngine(input);

  const ashrae = runASHRAEMasterEngine({
    lengthM: input.length,
    widthM: input.width,
    heightM: input.height,
    outsideDBT: input.outsideDBT || 35,
    outsideRH: input.outsideRH || 60,
    insideDBT: input.temperature || autoDesign.designBasis.temperature,
    insideRH: input.rh || autoDesign.designBasis.rh,
    people: input.people,
    lightingWm2: input.lightingWm2 || 15,
    equipmentW: input.equipmentLoadW,
    freshAirCMH: autoDesign.airflow.freshAirCMH,
    airflowCMH: autoDesign.airflow.supplyCMH,
    ach: autoDesign.designBasis.ach,
    ductVelocityMS: autoDesign.designBasis.ductVelocity,
    safetyFactor: input.safetyFactor || autoDesign.designBasis.safetyFactor,
    glassAreaM2: input.glassAreaM2 || 0,
    wallUValue: input.wallUValue || 1.5,
    roofUValue: input.roofUValue || 1.2,
    waterDeltaTC: input.chwDeltaT || 5,
  });

  autoDesign.coil.capacityTR = ashrae.load.loads.grandTotalTR;
  autoDesign.coil.loadKW = ashrae.load.loads.grandTotalKW;
  autoDesign.load.totalSensibleW = ashrae.load.loads.totalSensibleW;
  autoDesign.load.totalTR = ashrae.load.loads.grandTotalTR;

  const rooms = [
    {
      id: 1,
      name: autoDesign.designBasis.application,
      type: autoDesign.designBasis.application,
      supplyCMH: autoDesign.airflow.supplyCMH,
    },
  ];

  const ductRouting = runAutoDuctRoutingEngine({
    rooms,
    mainVelocity: autoDesign.designBasis.ductVelocity,
    branchVelocity: 6,
    mainLengthM: input.mainDuctLengthM || 15,
    branchLengthM: input.branchDuctLengthM || 8,
  });

  const pressureLoss = calculatePressureLoss({
    airflowCMH: autoDesign.airflow.supplyCMH,
    velocityMS: autoDesign.designBasis.ductVelocity,
    straightLengthM: input.mainDuctLengthM || 15,
    elbows: input.elbows || 3,
    reducers: input.reducers || 1,
    tees: input.tees || 1,
    dampers: input.dampers || 1,
    preFilterPa: 80,
    fineFilterPa: 120,
    coilPa: 150,
    hepaPa: autoDesign.filters.hepaQty > 0 ? 180 : 0,
    diffuserPa: 35,
    terminalPa: 50,
    safetyMarginPa: 100,
  });

  const fanSelection = selectFanFromCatalog({
    airflowCMH: autoDesign.airflow.supplyCMH,
    pressurePa: pressureLoss.recommendedFanPressure,
  });

  const filterSelection = selectFilterSet({
    airflowCMH: autoDesign.airflow.supplyCMH,
    application: autoDesign.designBasis.application,
    cleanroomClass: autoDesign.designBasis.cleanroomClass,
    dustLevel: input.dustLevel || "medium",
  });

  const coilSelection = selectCoolingCoil({
    requiredTR: ashrae.load.loads.grandTotalTR,
    airflowCMH: autoDesign.airflow.supplyCMH,
    chwDeltaT: input.chwDeltaT || 5,
    pipeLengthM: input.pipeLengthM || 30,
  });

  const pumpSelection = selectPumpFromCatalog({
    flowLPM: coilSelection.chilledWater.flowLPM,
    headM: coilSelection.chilledWater.selectedPumpHeadM,
  });

  const warnings = [
    ...(autoDesign.warnings || []),
    ...(ashrae.warnings || []),
    ...(ductRouting.warnings || []),
    ...(pressureLoss.warnings || []),
    ...(fanSelection.warnings || []),
    ...(filterSelection.warnings || []),
    ...(coilSelection.warnings || []),
    ...(pumpSelection.warnings || []),
  ];

  return {
    input,
    ashrae,
    autoDesign,
    ductRouting,
    pressureLoss,
    fanSelection,
    filterSelection,
    coilSelection,
    pumpSelection,
    warnings,
    summary: {
      application: autoDesign.designBasis.application,
      cleanroomClass: autoDesign.designBasis.cleanroomClass,
      airflowCMH: autoDesign.airflow.supplyCMH,
      totalPressurePa: pressureLoss.recommendedFanPressure,
      heatLoadTR: ashrae.load.loads.grandTotalTR,
      fanModel: fanSelection.selectedFan.model,
      motorHP: fanSelection.selectedFan.motorHP,
      filterStages: filterSelection.selectedFilters.length,
      coilModel: coilSelection.selectedCoil.model,
      coilTR: coilSelection.selectedCoil.capacityTR,
      chwFlowLPM: coilSelection.chilledWater.flowLPM,
      pumpModel: pumpSelection.selectedPump.model,
      estimatedSellingPrice: autoDesign.bom.selling,
    },
  };
}

export function createProjectSnapshot(projectResult) {
  return {
    projectName: projectResult.input.projectName || "Untitled Project",
    clientName: projectResult.input.clientName || "Client",
    createdAt: new Date().toISOString(),
    summary: projectResult.summary,
    fullDesign: projectResult,
  };
}

export function saveProjectLocal(projectResult) {
  const snapshot = createProjectSnapshot(projectResult);

  localStorage.setItem(
    "apfelGlobusEngineeringProject",
    JSON.stringify(snapshot)
  );

  return snapshot;
}

export function loadProjectLocal() {
  const saved = localStorage.getItem("apfelGlobusEngineeringProject");
  return saved ? JSON.parse(saved) : null;
}

export function clearProjectLocal() {
  localStorage.removeItem("apfelGlobusEngineeringProject");
}