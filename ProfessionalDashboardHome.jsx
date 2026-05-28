import React from "react";

export default function ProfessionalDashboardHome() {
  const stats = [
    { label: "Engineering Modules", value: "13" },
    { label: "Design Workflow", value: "AHU" },
    { label: "Export Formats", value: "JSON / CSV / PDF" },
    { label: "Status", value: "Professional" },
  ];

  const workflow = [
    "Design Basis",
    "Project Input",
    "Heat Load",
    "Psychrometric",
    "Coil Selection",
    "Blower Selection",
    "Filter Selection",
    "Duct Sizing",
    "AHU Costing",
    "Project Report",
    "Validation",
    "Export",
    "Settings",
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="bg-blue-950 text-white rounded-2xl shadow p-8 mb-6">
          <h1 className="text-4xl font-bold mb-2">
            Professional HVAC AHU Design Suite
          </h1>
          <p className="text-blue-200">
            Complete engineering workflow for AHU design, calculation,
            selection, costing, validation, reporting, and export.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {stats.map((item) => (
            <div key={item.label} className="bg-white rounded-2xl shadow p-5">
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-2xl font-bold text-blue-900 mt-1">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            AHU Design Workflow
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {workflow.map((step, index) => (
              <div
                key={step}
                className="border rounded-xl p-4 bg-gray-50 hover:bg-blue-50 transition"
              >
                <div className="text-sm text-gray-500">
                  Step {index + 1}
                </div>
                <div className="font-semibold text-blue-900">{step}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
          <h3 className="font-semibold text-blue-900 mb-2">
            Engineering Note
          </h3>
          <p className="text-sm text-blue-800">
            This dashboard is the home screen for your HVAC AHU app. Use the
            left-side module menu to open each engineering calculation and
            project workflow section.
          </p>
        </div>
      </div>
    </div>
  );
}