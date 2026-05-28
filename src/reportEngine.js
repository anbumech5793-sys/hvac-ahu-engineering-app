import jsPDF from "jspdf";

export function generateProfessionalReport(results, inputData) {
  const doc = new jsPDF();
  let y = 18;

  function addTitle(text) {
    doc.setFontSize(16);
    doc.setFont(undefined, "bold");
    doc.text(text, 15, y);
    y += 10;
  }

  function addSection(text) {
    if (y > 260) {
      doc.addPage();
      y = 18;
    }

    doc.setFontSize(13);
    doc.setFont(undefined, "bold");
    doc.text(text, 15, y);
    y += 8;
  }

  function addLine(label, value) {
    if (y > 280) {
      doc.addPage();
      y = 18;
    }

    doc.setFontSize(10);
    doc.setFont(undefined, "normal");
    doc.text(`${label}: ${value}`, 18, y);
    y += 6;
  }

  if (!results) {
    alert("Please calculate design first.");
    return;
  }

  addTitle("Apfel Globus HVAC & AHU Design Report");

  addLine("Project Name", inputData.project || "Not entered");
  addLine("Client Name", inputData.client || "Not entered");
  addLine("Room Type", inputData.roomType || "Not entered");
  addLine("Report Date", new Date().toLocaleString());

  y += 5;

  addSection("1. Standards / Design References");
  addLine("Cleanroom Classification", "ISO 14644-1");
  addLine("Cleanroom Testing", "ISO 14644-3");
  addLine("Pharma Guidance", "EU GMP Annex 1 where applicable");
  addLine("HVAC Design Reference", "ASHRAE");
  addLine("Duct Construction Reference", "SMACNA");
  addLine("Fan Performance Reference", "AMCA");
  addLine("Filter Reference", "EN 1822 / ISO 29463 / ISO 16890");

  addSection("2. Room Intelligence Design Basis");
  addLine("Room Type", results.roomBasis.roomType);
  addLine("Cleanroom Class", results.roomBasis.cleanroomClass);
  addLine("ACH Range", results.roomBasis.achRange);
  addLine("Recommended ACH", results.roomBasis.recommendedACH);
  addLine("Pressure Requirement", results.roomBasis.pressure);
  addLine("Filter Train", results.roomBasis.filterTrain);
  addLine("Airflow Pattern", results.roomBasis.airflowPattern);
  addLine("Risk Level", results.roomBasis.riskLevel);

  addSection("3. Room Calculation");
  addLine("Room Volume", `${results.volume.toFixed(2)} m³`);
  addLine("Selected ACH", results.ach);
  addLine("Required Airflow", `${results.airflow.toFixed(0)} CMH`);
  addLine("Fresh Air", `${results.freshAir.toFixed(0)} CMH`);

  addSection("4. Heat Load Calculation");
  addLine("Total Heat Load", `${results.totalTR.toFixed(2)} TR`);
  addLine("Cooling Coil Load", `${results.coilKW.toFixed(2)} kW`);
  addLine("Cooling Coil Load", `${results.coilTR.toFixed(2)} TR`);
  addLine("Chilled Water Flow", `${results.chwFlow.toFixed(2)} LPM`);

  addSection("5. Fan / Motor Selection");
  addLine("Total Static Pressure", `${results.staticPressure.toFixed(0)} Pa`);
  addLine("Calculated Fan Power", `${results.fanKW.toFixed(2)} kW`);
  addLine("Calculated Motor HP", `${results.fanHP.toFixed(2)} HP`);
  addLine("Selected Fan Model", results.catalog.selectedFan.model);
  addLine("Selected Motor Model", results.catalog.selectedMotor.model);

  addSection("6. Coil Selection");
  addLine("Selected Coil Model", results.catalog.selectedCoil.model);
  addLine("Coil Capacity", `${results.catalog.selectedCoil.tr} TR`);
  addLine("Coil Rows", `${results.catalog.selectedCoil.rows} Row`);
  addLine("Coil Airflow Rating", `${results.catalog.selectedCoil.airflow} CMH`);

  addSection("7. Filter Selection");
  addLine("Pre Filter", `${results.catalog.selectedFilters.preFilter.grade} - ${results.catalog.selectedFilters.preFilter.size}`);
  addLine("Fine Filter", `${results.catalog.selectedFilters.fineFilter.grade} - ${results.catalog.selectedFilters.fineFilter.size}`);
  addLine("HEPA Filter", `${results.catalog.selectedFilters.hepaFilter.grade} - ${results.catalog.selectedFilters.hepaFilter.size}`);
  addLine("HEPA Quantity", `${results.catalog.selectedFilters.hepaQty} Nos`);

  addSection("8. Duct Sizing");
  addLine("Equivalent Duct Diameter", `${results.ductDia.toFixed(0)} mm`);

  addSection("9. Cost Estimation");
  addLine("Material Cost", `Rs. ${results.materialCost.toFixed(0)}`);
  addLine("Fabrication Cost", `Rs. ${results.fabrication.toFixed(0)}`);
  addLine("Overhead", `Rs. ${results.overhead.toFixed(0)}`);
  addLine("Profit", `Rs. ${results.profit.toFixed(0)}`);
  addLine("Estimated Selling Price", `Rs. ${results.selling.toFixed(0)}`);

  addSection("10. GMP / Validation Notes");
  addLine("IQ", "Installation Qualification required");
  addLine("OQ", "Operational Qualification required");
  addLine("PQ", "Performance Qualification required");
  addLine("Testing", "Airflow, pressure, particle count, recovery, filter integrity test required");
  addLine("Important", "Final design must be reviewed and approved by qualified HVAC/pharma cleanroom professionals.");

  addSection("11. Disclaimer");
  addLine(
    "Note",
    "This report is generated for engineering design assistance. Final compliance depends on site testing, commissioning, validation, and approved URS/design documents."
  );

  doc.save("Apfel_Globus_HVAC_AHU_Design_Report.pdf");
}