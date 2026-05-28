import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, Scatter,
  ResponsiveContainer,
} from "recharts";

import {
  runCompleteProjectDesign,
  saveProjectLocal,
  loadProjectLocal,
  clearProjectLocal,
} from "./projectDataEngine";

import { generateCompleteProjectPDF } from "./pdfReportEngine";

function CompleteProjectDashboard() {
  const [input, setInput] = useState({
    projectName: "Demo Pharma Project",
    clientName: "ABC Pharma",
    application: "Pharma Cleanroom",
    length: 6,
    width: 5,
    height: 3,
    people: 4,
    equipmentLoadW: 3000,
    lightingLoadW: 600,
    outsideDBT: 35,
    outsideRH: 60,
    temperature: 22,
    rh: 50,
  });

  const [project, setProject] = useState(null);

  function update(key, value) {
    setInput({ ...input, [key]: value });
  }

  function runDesign() {
    setProject(runCompleteProjectDesign(input));
  }

  function saveProject() {
    if (!project) return alert("Please run complete design first.");
    saveProjectLocal(project);
    alert("Project saved locally.");
  }

  function loadProject() {
    const saved = loadProjectLocal();
    if (!saved) return alert("No saved project found.");
    setProject(saved.fullDesign);
    alert("Project loaded.");
  }

  function clearProject() {
    clearProjectLocal();
    alert("Saved project cleared.");
  }

  function exportPDF() {
    generateCompleteProjectPDF(project);
  }

  const costData = project ? [
    { name: "Material", value: project.autoDesign.bom.material },
    { name: "Fabrication", value: project.autoDesign.bom.fabrication },
    { name: "Installation", value: project.autoDesign.bom.installation },
    { name: "Overhead", value: project.autoDesign.bom.overhead },
    { name: "Profit", value: project.autoDesign.bom.profit },
  ] : [];

  const psychData = project?.autoDesign?.psychrometrics?.processPoints || [];
  const pressureBreakdown = project?.pressureLoss?.breakdown || [];
  const filterPressure = project?.filterSelection?.selectedFilters?.map((f) => ({
    grade: f.grade,
    initial: f.totalInitialPressurePa,
    final: f.totalFinalPressurePa,
  })) || [];

  const colors = ["#e00000", "#111111", "#0066ff", "#777777", "#00a86b"];

  return (
    <div className="completeApp">
      <header className="completeHeader">
        <div>
          <h1>Complete Project Design Dashboard</h1>
          <p>One input → HVAC • AHU • Duct • Pressure • Fan • Filter • Coil • Pump • BOM • PDF</p>
        </div>

        <div className="topActions">
          <button onClick={runDesign}>Run Complete Design</button>
          <button onClick={exportPDF}>Generate PDF Report</button>
          <button onClick={saveProject}>Save</button>
          <button onClick={loadProject}>Load</button>
          <button onClick={clearProject}>Clear</button>
        </div>
      </header>

      <div className="completeGrid">
        <aside className="completeInputPanel">
          <h2>Project Input</h2>

          <label>Project Name</label>
          <input value={input.projectName} onChange={(e) => update("projectName", e.target.value)} />

          <label>Client Name</label>
          <input value={input.clientName} onChange={(e) => update("clientName", e.target.value)} />

          <label>Application</label>
          <select value={input.application} onChange={(e) => update("application", e.target.value)}>
            <option>Pharma Cleanroom</option>
            <option>Pharma Machine AHU</option>
            <option>Office HVAC</option>
            <option>Commercial Room</option>
            <option>Warehouse</option>
            <option>Hospital HVAC</option>
          </select>

          <h3>Room Size</h3>

          <label>Length m</label>
          <input type="number" value={input.length} onChange={(e) => update("length", e.target.value)} />

          <label>Width m</label>
          <input type="number" value={input.width} onChange={(e) => update("width", e.target.value)} />

          <label>Height m</label>
          <input type="number" value={input.height} onChange={(e) => update("height", e.target.value)} />

          <h3>Load Data</h3>

          <label>People</label>
          <input type="number" value={input.people} onChange={(e) => update("people", e.target.value)} />

          <label>Equipment Load W</label>
          <input type="number" value={input.equipmentLoadW} onChange={(e) => update("equipmentLoadW", e.target.value)} />

          <label>Lighting Load W</label>
          <input type="number" value={input.lightingLoadW} onChange={(e) => update("lightingLoadW", e.target.value)} />

          <h3>Air Conditions</h3>

          <label>Outdoor DBT °C</label>
          <input type="number" value={input.outsideDBT} onChange={(e) => update("outsideDBT", e.target.value)} />

          <label>Outdoor RH %</label>
          <input type="number" value={input.outsideRH} onChange={(e) => update("outsideRH", e.target.value)} />

          <label>Room Temperature °C</label>
          <input type="number" value={input.temperature} onChange={(e) => update("temperature", e.target.value)} />

          <label>Room RH %</label>
          <input type="number" value={input.rh} onChange={(e) => update("rh", e.target.value)} />
        </aside>

        <main className="completeOutputPanel">
          {!project && (
            <section className="emptyState">
              <h2>Ready for Complete Design</h2>
              <p>Enter project details and click Run Complete Design.</p>
            </section>
          )}

          {project && (
            <>
              <section className="kpiGrid">
                <div><span>Application</span><strong>{project.summary.application}</strong></div>
                <div><span>Airflow</span><strong>{project.summary.airflowCMH.toFixed(0)} CMH</strong></div>
                <div><span>Pressure</span><strong>{project.summary.totalPressurePa} Pa</strong></div>
                <div><span>Fan</span><strong>{project.summary.fanModel}</strong></div>
                <div><span>Coil</span><strong>{project.summary.coilModel}</strong></div>
                <div><span>Pump</span><strong>{project.summary.pumpModel}</strong></div>
                <div><span>CHW Flow</span><strong>{project.summary.chwFlowLPM} LPM</strong></div>
                <div><span>Price</span><strong>₹{project.summary.estimatedSellingPrice}</strong></div>
              </section>

              <section className="standardPanel">
                <h2>Design Basis</h2>
                <p><b>Project:</b> {input.projectName}</p>
                <p><b>Client:</b> {input.clientName}</p>
                <p><b>Class:</b> {project.autoDesign.designBasis.cleanroomClass}</p>
                <p><b>ACH:</b> {project.autoDesign.designBasis.ach}</p>
                <p><b>Temperature/RH:</b> {project.autoDesign.designBasis.temperature}°C / {project.autoDesign.designBasis.rh}%</p>
                <p><b>Pressure:</b> +{project.autoDesign.designBasis.pressure} Pa</p>
                <p><b>Filter Train:</b> {project.autoDesign.designBasis.filterTrain}</p>
              </section>

              <section className="drawingPanel">
                <h2>Automatic HVAC Layout Concept</h2>
                <svg viewBox="0 0 1000 420">
                  <rect x="60" y="60" width="860" height="290" fill="#fff" stroke="#111" strokeWidth="4" />
                  <rect x="110" y="105" width="280" height="150" fill="#f5f5f5" stroke="#111" strokeWidth="3" />
                  <text x="150" y="180" fontSize="22">{project.summary.application}</text>
                  <rect x="450" y="105" width="170" height="150" fill="#e8f3ff" stroke="#111" strokeWidth="3" />
                  <text x="495" y="180" fontSize="22">Airlock</text>
                  <rect x="690" y="105" width="170" height="150" fill="#e8ffe8" stroke="#111" strokeWidth="3" />
                  <text x="730" y="180" fontSize="22">Corridor</text>
                  <line x1="160" y1="305" x2="780" y2="305" stroke="#e00000" strokeWidth="8" />
                  <text x="410" y="292" fill="#e00000" fontSize="20">Main Supply Duct</text>
                  <circle cx="230" cy="305" r="22" fill="#0066ff" />
                  <circle cx="520" cy="305" r="22" fill="#0066ff" />
                  <circle cx="760" cy="305" r="22" fill="#0066ff" />
                </svg>
              </section>

              <section className="chartGrid">
                <div className="chartCard">
                  <h2>Psychrometric Process</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={psychData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dbt" />
                      <YAxis dataKey="humidityRatio" />
                      <Tooltip />
                      <Legend />
                      <Line dataKey="humidityRatio" stroke="#e00000" strokeWidth={4} name="Humidity Ratio g/kg" />
                      <Scatter data={psychData} dataKey="humidityRatio" fill="#111111" name="State Points" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Pressure Loss Breakdown</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={pressureBreakdown}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="item" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pressure" fill="#e00000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Filter Pressure Drop</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={filterPressure}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="grade" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="initial" fill="#0066ff" name="Initial Pa" />
                      <Bar dataKey="final" fill="#e00000" name="Final Pa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>BOM Cost Split</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie data={costData} dataKey="value" nameKey="name" outerRadius={90} label>
                        {costData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="tablePanel">
                <h2>Complete Engineering Summary</h2>
                <table>
                  <tbody>
                    <tr><td>Room Volume</td><td>{project.autoDesign.room.volume.toFixed(2)} m³</td></tr>
                    <tr><td>Supply Airflow</td><td>{project.autoDesign.airflow.supplyCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Fresh Air</td><td>{project.autoDesign.airflow.freshAirCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Return Air</td><td>{project.autoDesign.airflow.returnAirCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Cooling Coil</td><td>{project.coilSelection.selectedCoil.model}</td></tr>
                    <tr><td>Coil Capacity</td><td>{project.coilSelection.selectedCoil.capacityTR} TR</td></tr>
                    <tr><td>Fan Model</td><td>{project.fanSelection.selectedFan.model}</td></tr>
                    <tr><td>Motor HP</td><td>{project.fanSelection.selectedFan.motorHP} HP</td></tr>
                    <tr><td>Filter Stages</td><td>{project.filterSelection.selectedFilters.length}</td></tr>
                    <tr><td>Pump Model</td><td>{project.pumpSelection.selectedPump.model}</td></tr>
                    <tr><td>Pump Head</td><td>{project.pumpSelection.selectedPump.headM} m</td></tr>
                  </tbody>
                </table>
              </section>

              <section className="tablePanel">
                <h2>Selected Equipment</h2>
                <table>
                  <thead>
                    <tr>
                      <th>Equipment</th>
                      <th>Selected Model</th>
                      <th>Main Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Fan</td>
                      <td>{project.fanSelection.selectedFan.model}</td>
                      <td>{project.fanSelection.selectedFan.airflowCMH} CMH / {project.fanSelection.selectedFan.pressurePa} Pa / {project.fanSelection.selectedFan.motorHP} HP</td>
                    </tr>
                    <tr>
                      <td>Filter Set</td>
                      <td>{project.filterSelection.selectedFilters.map((f) => f.grade).join(" + ")}</td>
                      <td>Initial PD {project.filterSelection.totalInitialPressurePa} Pa / Final PD {project.filterSelection.totalFinalPressurePa} Pa</td>
                    </tr>
                    <tr>
                      <td>Cooling Coil</td>
                      <td>{project.coilSelection.selectedCoil.model}</td>
                      <td>{project.coilSelection.selectedCoil.capacityTR} TR / {project.coilSelection.selectedCoil.rows} Row / CHW {project.coilSelection.chilledWater.flowLPM} LPM</td>
                    </tr>
                    <tr>
                      <td>Pump</td>
                      <td>{project.pumpSelection.selectedPump.model}</td>
                      <td>{project.pumpSelection.selectedPump.flowLPM} LPM / {project.pumpSelection.selectedPump.headM} m / {project.pumpSelection.selectedPump.motorHP} HP</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {project.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Project Warnings + Validation Notes</h2>
                  {project.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default CompleteProjectDashboard;