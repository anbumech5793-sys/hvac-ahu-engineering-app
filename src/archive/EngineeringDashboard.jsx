import { useState } from "react";

import ProfessionalProjectInputDashboard from "./ProfessionalProjectInputDashboard";
import CompleteProjectDashboard from "./CompleteProjectDashboard";
import FinalEngineeringOS from "./FinalEngineeringOS";
import MultiRoomDashboard from "./MultiRoomDashboard";
import AutoDuctRoutingDashboard from "./AutoDuctRoutingDashboard";
import PressureLossDashboard from "./PressureLossDashboard";
import FanCatalogDashboard from "./FanCatalogDashboard";
import FilterCatalogDashboard from "./FilterCatalogDashboard";
import CoilCatalogDashboard from "./CoilCatalogDashboard";
import PumpCatalogDashboard from "./PumpCatalogDashboard";

function EngineeringOSDashboard() {
  const [activeModule, setActiveModule] = useState("professionalInput");

  const modules = [
    { id: "home", name: "Dashboard" },
    { id: "professionalInput", name: "Professional Project Input" },
    { id: "completeProject", name: "Complete Project Design" },
    { id: "autoDesign", name: "Auto Design Wizard" },
    { id: "multiRoom", name: "Multi-Room Zoning" },
    { id: "duct", name: "Auto Duct Routing" },
    { id: "pressure", name: "Pressure Loss" },
    { id: "fan", name: "Fan Selection" },
    { id: "filter", name: "Filter Selection" },
    { id: "coil", name: "Coil + CHW Piping" },
    { id: "pump", name: "Pump Selection" },
    { id: "reports", name: "Reports" },
    { id: "project", name: "Project Manager" },
  ];

  function renderModule() {
    if (activeModule === "professionalInput") {
      return <ProfessionalProjectInputDashboard />;
    }

    if (activeModule === "completeProject") {
      return <CompleteProjectDashboard />;
    }

    if (activeModule === "autoDesign") {
      return <FinalEngineeringOS />;
    }

    if (activeModule === "multiRoom") {
      return <MultiRoomDashboard />;
    }

    if (activeModule === "duct") {
      return <AutoDuctRoutingDashboard />;
    }

    if (activeModule === "pressure") {
      return <PressureLossDashboard />;
    }

    if (activeModule === "fan") {
      return <FanCatalogDashboard />;
    }

    if (activeModule === "filter") {
      return <FilterCatalogDashboard />;
    }

    if (activeModule === "coil") {
      return <CoilCatalogDashboard />;
    }

    if (activeModule === "pump") {
      return <PumpCatalogDashboard />;
    }

    if (activeModule === "reports") {
      return (
        <div className="osPlaceholder">
          <h2>Reports Module</h2>
          <p>
            PDF report, quotation, BOM report, validation report and GMP
            documentation will be connected here.
          </p>
        </div>
      );
    }

    if (activeModule === "project") {
      return (
        <div className="osPlaceholder">
          <h2>Project Manager</h2>
          <p>
            Save, load, cloud sync, user access, revision history and client
            approval workflow will be connected here.
          </p>
        </div>
      );
    }

    return (
      <div className="osHome">
        <h1>Apfel Globus Engineering OS</h1>
        <p>
          Professional HVAC • AHU • Cleanroom • Pharma Engineering Platform
        </p>

        <div className="osCards">
          <div>
            <h3>Professional Project Input</h3>
            <p>
              Create professional design basis from project application, room
              size, cleanroom class, ACH, pressure and standards.
            </p>
          </div>

          <div>
            <h3>Complete Project Design</h3>
            <p>
              One input creates full HVAC/AHU design with duct, pressure, fan,
              filter, coil, pump, BOM and warnings.
            </p>
          </div>

          <div>
            <h3>Auto Design Wizard</h3>
            <p>
              Room size + application gives automatic airflow, heat load,
              AHU sizing and cleanroom design basis.
            </p>
          </div>

          <div>
            <h3>Multi-Room Zoning</h3>
            <p>
              Room-wise airflow, return air, exhaust air and pressure cascade.
            </p>
          </div>

          <div>
            <h3>Duct Routing</h3>
            <p>
              Main duct, branch duct, diffuser quantity and duct pressure loss.
            </p>
          </div>

          <div>
            <h3>Fan Selection</h3>
            <p>
              Fan catalog model, curve, duty point, motor HP and efficiency.
            </p>
          </div>

          <div>
            <h3>Filter Selection</h3>
            <p>
              G4, F8, H13/H14 filter quantity, face velocity and pressure drop.
            </p>
          </div>

          <div>
            <h3>Coil + CHW Piping</h3>
            <p>
              Cooling coil model, CHW flow, pipe size, valve size and pump head.
            </p>
          </div>

          <div>
            <h3>Pump Selection</h3>
            <p>
              Pump catalog model, flow, head, motor HP, efficiency and curve.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="engineeringOS">
      <aside className="osSidebar">
        <h2>Apfel Globus</h2>
        <p>Engineering OS</p>

        {modules.map((module) => (
          <button
            key={module.id}
            className={activeModule === module.id ? "osActive" : ""}
            onClick={() => setActiveModule(module.id)}
          >
            {module.name}
          </button>
        ))}
      </aside>

      <main className="osWorkspace">{renderModule()}</main>
    </div>
  );
}

export default EngineeringOSDashboard;