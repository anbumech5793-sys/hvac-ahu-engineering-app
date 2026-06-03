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
  const [menuOpen, setMenuOpen] = useState(false);

  const loggedEmail = String(
    access?.profile?.email || loginEmail || userEmail || ""
  )
    .trim()
    .toLowerCase();

  const userRole = String(access?.profile?.role || "user")
    .trim()
    .toLowerCase();

  const isAdmin =
    userRole === "admin" || loggedEmail === "anbu.mech5793@gmail.com";

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

  const handleMenuClick = (key) => {
    setActiveModule(key);
    setMenuOpen(false);
  };

  const renderModule = () => {
    if ((activeModule === "admin" || activeModule === "materialPrices") && !isAdmin) {
      return <ProfessionalDashboardHome />;
    }

    switch (activeModule) {
      case "home":
        return <ProfessionalDashboardHome />;

      case "projectInput":
        return <ProfessionalProjectInputDashboard />;

      case "heatLoad":
        return <ProfessionalHeatLoadDashboard />;

      case "psychrometric":
        return <ProfessionalPsychrometricDashboard />;

      case "coilSelection":
        return <ProfessionalCoilSelectionDashboard />;

      case "blowerSelection":
        return <ProfessionalBlowerSelectionDashboard />;

      case "filterSelection":
        return <ProfessionalFilterSelectionDashboard />;

      case "ductSizing":
        return <ProfessionalDuctSizingDashboard />;

      case "ahuLayout":
        return <ProfessionalAHULayoutDashboard />;

      case "ahuGA":
        return <ProfessionalAHUGADrawingDashboard />;

      case "bom":
        return <ProfessionalBOMDashboard />;

      case "quotation":
        return <ProfessionalQuotationDashboard />;

      case "projectReport":
        return <ProfessionalProjectReportDashboard />;

      case "export":
        return <ProfessionalExportDashboard />;

      case "validation":
        return <ProfessionalValidationDashboard />;

      case "projectDatabase":
        return <ProfessionalProjectDatabaseDashboard />;

      case "ahuCosting":
        return <ProfessionalAHUCostingDashboard />;

      case "materialPrices":
        return isAdmin ? <ProfessionalMaterialPriceDashboard /> : <ProfessionalDashboardHome />;

      case "admin":
        return isAdmin ? <ProfessionalAdminDashboard /> : <ProfessionalDashboardHome />;

      case "settings":
        return <ProfessionalSettingsDashboard />;

      default:
        return <ProfessionalDashboardHome />;
    }
  };

  return (
    <>
      <style>{responsiveCSS}</style>

      <div className="engineering-mobile-topbar">
        <button
          className="engineering-mobile-menu-btn"
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? "Close Menu" : "Open Menu"}
        </button>

        <strong>Apfel Globus Engineering OS</strong>
      </div>

      <div className="engineering-layout" style={styles.app}>
        <aside
          className={`engineering-sidebar ${menuOpen ? "mobile-open" : ""}`}
          style={styles.sidebar}
        >
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
                onClick={() => handleMenuClick(key)}
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
.engineering-mobile-topbar {
  display: none;
}

@media (max-width: 768px) {
  body {
    overflow-x: hidden !important;
  }

  .engineering-mobile-topbar {
    display: flex !important;
    position: sticky;
    top: 0;
    z-index: 9999;
    background: #050505;
    color: white;
    padding: 12px;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    border-bottom: 2px solid #333;
  }

  .engineering-mobile-menu-btn {
    background: #e60000;
    color: white;
    border: none;
    border-radius: 10px;
    padding: 10px 14px;
    font-weight: 900;
    cursor: pointer;
  }

  .engineering-layout {
    flex-direction: column !important;
    height: auto !important;
    min-height: 100vh !important;
    overflow: visible !important;
  }

  .engineering-sidebar {
    width: 100% !important;
    height: auto !important;
    max-height: 0 !important;
    overflow: hidden !important;
    padding: 0 16px !important;
    border-right: none !important;
    border-bottom: 2px solid #333 !important;
    transition: max-height 0.25s ease, padding 0.25s ease !important;
  }

  .engineering-sidebar.mobile-open {
    max-height: 70vh !important;
    overflow-y: auto !important;
    padding: 16px !important;
  }

  .engineering-menu {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
    padding-bottom: 16px !important;
  }

  .engineering-menu button {
    font-size: 13px !important;
    padding: 12px 10px !important;
    border-radius: 12px !important;
    text-align: center !important;
  }

  .engineering-content {
    width: 100% !important;
    height: auto !important;
    min-height: 70vh !important;
    padding: 16px 12px 90px 12px !important;
    overflow-x: auto !important;
    overflow-y: visible !important;
    box-sizing: border-box !important;
  }

  .engineering-content h1 {
    font-size: 26px !important;
    line-height: 1.2 !important;
  }

  .engineering-content h2 {
    font-size: 20px !important;
  }

  .engineering-content table {
    min-width: 850px !important;
  }

  .engineering-content svg {
    min-width: 850px !important;
  }

  .engineering-content input,
  .engineering-content select,
  .engineering-content button {
    max-width: 100% !important;
  }

  .engineering-content [style*="grid-template-columns"] {
    grid-template-columns: 1fr !important;
  }
}

@media (max-width: 480px) {
  .engineering-menu {
    grid-template-columns: 1fr !important;
  }

  .engineering-mobile-topbar strong {
    font-size: 13px !important;
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