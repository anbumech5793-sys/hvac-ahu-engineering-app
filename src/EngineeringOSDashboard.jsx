import React, { useState } from "react";

import ProfessionalDashboardHome from "./components/ProfessionalDashboardHome";
import ProfessionalProjectInputDashboard from "./components/ProfessionalProjectInputDashboard";
import ProfessionalHeatLoadDashboard from "./components/ProfessionalHeatLoadDashboard";
import ProfessionalPsychrometricDashboard from "./components/ProfessionalPsychrometricDashboard";
import ProfessionalCoilSelectionDashboard from "./components/ProfessionalCoilSelectionDashboard";
import ProfessionalBlowerSelectionDashboard from "./components/ProfessionalBlowerSelectionDashboard";
import ProfessionalFilterSelectionDashboard from "./components/ProfessionalFilterSelectionDashboard";
import ProfessionalDuctSizingDashboard from "./components/ProfessionalDuctSizingDashboard";
import ProfessionalAHUCostingDashboard from "./components/ProfessionalAHUCostingDashboard";
import ProfessionalAHULayoutDashboard from "./components/ProfessionalAHULayoutDashboard";
import ProfessionalBOMDashboard from "./components/ProfessionalBOMDashboard";
import ProfessionalProjectReportDashboard from "./components/ProfessionalProjectReportDashboard";
import ProfessionalExportDashboard from "./components/ProfessionalExportDashboard";
import ProfessionalValidationDashboard from "./components/ProfessionalValidationDashboard";
import ProfessionalProjectDatabaseDashboard from "./components/ProfessionalProjectDatabaseDashboard";
import ProfessionalAdminDashboard from "./components/ProfessionalAdminDashboard";
import ProfessionalSettingsDashboard from "./components/ProfessionalSettingsDashboard";

export default function EngineeringOSDashboard({ access, loginEmail }) {
  const [activeModule, setActiveModule] = useState("home");

  const loggedEmail = String(
    access?.profile?.email || loginEmail || ""
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
    ["ahuCosting", "AHU Costing"],
    ["ahuLayout", "AHU GA Drawing"],
    ["bom", "BOM Schedule"],
    ["projectReport", "Project Report"],
    ["export", "Export"],
    ["validation", "Validation"],
    ["projectDatabase", "Project Database"],
    ...(isAdmin ? [["admin", "Admin Panel"]] : []),
    ["settings", "Settings"],
  ];

  const renderModule = () => {
    if (activeModule === "admin" && !isAdmin) {
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

      case "ahuCosting":
        return <ProfessionalAHUCostingDashboard />;

      case "ahuLayout":
        return <ProfessionalAHULayoutDashboard />;

      case "bom":
        return <ProfessionalBOMDashboard />;

      case "projectReport":
        return <ProfessionalProjectReportDashboard />;

      case "export":
        return <ProfessionalExportDashboard />;

      case "validation":
        return <ProfessionalValidationDashboard />;

      case "projectDatabase":
        return <ProfessionalProjectDatabaseDashboard />;

      case "admin":
        return isAdmin ? (
          <ProfessionalAdminDashboard />
        ) : (
          <ProfessionalDashboardHome />
        );

      case "settings":
        return <ProfessionalSettingsDashboard />;

      default:
        return <ProfessionalDashboardHome />;
    }
  };

  return (
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
  );
}

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
    overflowX: "hidden",
    scrollBehavior: "smooth",
    boxSizing: "border-box",
  },
};