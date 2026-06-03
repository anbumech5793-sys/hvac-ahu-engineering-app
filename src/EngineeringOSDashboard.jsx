import React, { useState } from "react";

import ProfessionalDashboardHome from "./components/ProfessionalDashboardHome";
import ProfessionalProjectInputDashboard from "./components/ProfessionalProjectInputDashboard";
import ProfessionalHeatLoadDashboard from "./components/ProfessionalHeatLoadDashboard";
import ProfessionalPsychrometricDashboard from "./components/ProfessionalPsychrometricDashboard";
import ProfessionalCoilSelectionDashboard from "./components/ProfessionalCoilSelectionDashboard";
import ProfessionalBlowerSelectionDashboard from "./components/ProfessionalBlowerSelectionDashboard";
import ProfessionalFilterSelectionDashboard from "./components/ProfessionalFilterSelectionDashboard";
import ProfessionalDuctSizingDashboard from "./components/ProfessionalDuctSizingDashboard";
import ProfessionalAHULayoutDashboard from "./components/ProfessionalAHULayoutDashboard";
import ProfessionalAHUGADrawingDashboard from "./components/ProfessionalAHUGADrawingDashboard";
import ProfessionalBOMDashboard from "./components/ProfessionalBOMDashboard";
import ProfessionalQuotationDashboard from "./components/ProfessionalQuotationDashboard";
import ProfessionalProjectReportDashboard from "./components/ProfessionalProjectReportDashboard";
import ProfessionalExportDashboard from "./components/ProfessionalExportDashboard";
import ProfessionalValidationDashboard from "./components/ProfessionalValidationDashboard";
import ProfessionalProjectDatabaseDashboard from "./components/ProfessionalProjectDatabaseDashboard";
import ProfessionalAHUCostingDashboard from "./components/ProfessionalAHUCostingDashboard";
import ProfessionalMaterialPriceDashboard from "./components/ProfessionalMaterialPriceDashboard";
import ProfessionalAdminDashboard from "./components/ProfessionalAdminDashboard";
import ProfessionalSettingsDashboard from "./components/ProfessionalSettingsDashboard";

export default function EngineeringOSDashboard({ access, loginEmail, userEmail }) {
  const [activeModule, setActiveModule] = useState("home");

  const loggedEmail = String(access?.profile?.email || loginEmail || userEmail || "")
    .trim()
    .toLowerCase();

  const userRole = String(access?.profile?.role || "user").trim().toLowerCase();
  const isAdmin = userRole === "admin" || loggedEmail === "anbu.mech5793@gmail.com";

  const modules = [
    ["home", "Home"],
    ["projectInput", "Project Input"],
    ["heatLoad", "Heat Load"],
    ["psychrometric", "Psychrometric"],
    ["coilSelection", "Coil Selection"],
    ["blowerSelection", "Blower Selection"],
    ["filterSelection", "Filter Selection"],
    ["ductSizing", "Duct Sizing"],
    ["ahuLayout", "AHU Layout"],
    ["ahuGA", "AHU GA Drawing"],
    ["bom", "BOM Schedule"],
    ["projectReport", "Project Report"],
    ["export", "Export"],
    ["validation", "Validation"],
    ["projectDatabase", "Project Database"],
    ["quotation", "Auto Quotation"],
    ["ahuCosting", "AI AHU Costing"],
    ...(isAdmin ? [["materialPrices", "Material Price Database"]] : []),
    ...(isAdmin ? [["admin", "Admin Panel"]] : []),
    ["settings", "Settings"],
  ];

  const renderModule = () => {
    if ((activeModule === "admin" || activeModule === "materialPrices") && !isAdmin) {
      return <ProfessionalDashboardHome />;
    }

    switch (activeModule) {
      case "home": return <ProfessionalDashboardHome />;
      case "projectInput": return <ProfessionalProjectInputDashboard />;
      case "heatLoad": return <ProfessionalHeatLoadDashboard />;
      case "psychrometric": return <ProfessionalPsychrometricDashboard />;
      case "coilSelection": return <ProfessionalCoilSelectionDashboard />;
      case "blowerSelection": return <ProfessionalBlowerSelectionDashboard />;
      case "filterSelection": return <ProfessionalFilterSelectionDashboard />;
      case "ductSizing": return <ProfessionalDuctSizingDashboard />;
      case "ahuLayout": return <ProfessionalAHULayoutDashboard />;
      case "ahuGA": return <ProfessionalAHUGADrawingDashboard />;
      case "bom": return <ProfessionalBOMDashboard />;
      case "quotation": return <ProfessionalQuotationDashboard />;
      case "projectReport": return <ProfessionalProjectReportDashboard />;
      case "export": return <ProfessionalExportDashboard />;
      case "validation": return <ProfessionalValidationDashboard />;
      case "projectDatabase": return <ProfessionalProjectDatabaseDashboard />;
      case "ahuCosting": return <ProfessionalAHUCostingDashboard />;
      case "materialPrices": return isAdmin ? <ProfessionalMaterialPriceDashboard /> : <ProfessionalDashboardHome />;
      case "admin": return isAdmin ? <ProfessionalAdminDashboard /> : <ProfessionalDashboardHome />;
      case "settings": return <ProfessionalSettingsDashboard />;
      default: return <ProfessionalDashboardHome />;
    }
  };

  return (
    <>
      <style>{responsiveCSS}</style>

      <div className="mobile-module-bar">
        <label>Module</label>
        <select value={activeModule} onChange={(e) => setActiveModule(e.target.value)}>
          {modules.map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div className="engineering-layout" style={styles.app}>
        <aside className="engineering-sidebar" style={styles.sidebar}>
          <h2 style={styles.sidebarTitle}>Engineering Modules</h2>

          <div style={styles.userRoleBox}>
            Logged in as: <strong>{isAdmin ? "Admin" : "User"}</strong>
            <br />
            Email: <strong>{loggedEmail || "unknown"}</strong>
          </div>

          <div className="engineering-menu" style={styles.menu}>
            {modules.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveModule(key)}
                style={{
                  ...styles.menuButton,
                  ...(activeModule === key ? styles.activeButton : {}),
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </aside>

        <main className="engineering-content" style={styles.content}>
          {renderModule()}
        </main>
      </div>
    </>
  );
}

const responsiveCSS = `
.mobile-module-bar {
  display: none;
}

@media (max-width: 768px) {
  html, body, #root {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  .engineering-sidebar {
    display: none !important;
  }

  .mobile-module-bar {
    display: flex !important;
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #050505;
    padding: 12px;
    gap: 10px;
    align-items: center;
    border-bottom: 2px solid #ffcc00;
  }

  .mobile-module-bar label {
    color: #ffcc00;
    font-weight: 900;
    font-size: 14px;
  }

  .mobile-module-bar select {
    flex: 1;
    padding: 12px;
    border-radius: 12px;
    border: 2px solid #ffcc00;
    font-weight: 900;
    font-size: 15px;
    background: white;
    color: #111827;
  }

  .engineering-layout {
    display: block !important;
    height: auto !important;
    min-height: 100vh !important;
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
  }

  .engineering-content {
    width: 100% !important;
    max-width: 100% !important;
    height: auto !important;
    min-height: 100vh !important;
    padding: 14px 10px 90px 10px !important;
    overflow-x: hidden !important;
    overflow-y: visible !important;
    box-sizing: border-box !important;
  }

  .engineering-content > div {
    width: 100% !important;
    max-width: 100% !important;
    overflow-x: hidden !important;
    box-sizing: border-box !important;
  }

  .engineering-content h1 {
    font-size: 24px !important;
    line-height: 1.25 !important;
    word-break: break-word !important;
  }

  .engineering-content h2 {
    font-size: 19px !important;
    line-height: 1.25 !important;
  }

  .engineering-content p {
    font-size: 14px !important;
  }

  .engineering-content [style*="grid-template-columns"] {
    display: grid !important;
    grid-template-columns: 1fr !important;
  }

  .engineering-content [style*="box-shadow"] {
    padding: 16px !important;
    border-radius: 16px !important;
    margin-bottom: 18px !important;
  }

  .engineering-content table {
    min-width: 800px !important;
  }

  .engineering-content svg {
    min-width: 850px !important;
  }

  .engineering-content div:has(table),
  .engineering-content div:has(svg) {
    overflow-x: auto !important;
  }

  .engineering-content input,
  .engineering-content select,
  .engineering-content button {
    max-width: 100% !important;
    box-sizing: border-box !important;
  }
}
`;

const styles = {
  app: {
    display: "flex",
    height: "calc(100vh - 92px)",
    background: "#e5e7eb",
    overflow: "hidden",
  },

  sidebar: {
    width: "320px",
    height: "calc(100vh - 92px)",
    background: "#050505",
    color: "white",
    padding: "28px 24px 100px 24px",
    overflowY: "auto",
    overflowX: "hidden",
    borderRight: "1px solid #1f2937",
    flexShrink: 0,
    boxSizing: "border-box",
  },

  sidebarTitle: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "14px",
  },

  userRoleBox: {
    background: "#171717",
    border: "1px solid #333",
    borderRadius: "14px",
    padding: "12px",
    marginBottom: "22px",
    color: "#ffcc00",
    fontSize: "14px",
    lineHeight: "1.6",
    wordBreak: "break-word",
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    paddingBottom: "100px",
  },

  menuButton: {
    background: "#171717",
    color: "white",
    border: "1px solid #333",
    borderRadius: "18px",
    padding: "18px 20px",
    textAlign: "left",
    fontSize: "18px",
    fontWeight: "800",
    cursor: "pointer",
    flexShrink: 0,
  },

  activeButton: {
    background: "#e60000",
    border: "2px solid #ffcc00",
  },

  content: {
    flex: 1,
    height: "calc(100vh - 92px)",
    padding: "48px 42px 160px 42px",
    overflowY: "auto",
    overflowX: "auto",
    scrollBehavior: "smooth",
    boxSizing: "border-box",
  },
};