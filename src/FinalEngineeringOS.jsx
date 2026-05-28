import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from "recharts";
import { runAutoDesignEngine } from "./autoDesignEngine";

function FinalEngineeringOS() {
  const [input, setInput] = useState({
    application: "Pharma Cleanroom",
    length: 6,
    width: 5,
    height: 3,
  });

  const [design, setDesign] = useState(null);

  function update(key, value) {
    setInput({ ...input, [key]: value });
  }

  function generateDesign() {
    const result = runAutoDesignEngine(input);
    setDesign(result);
  }

  const fanCurve = [
    { airflow: 1000, fan: 950, system: 80 },
    { airflow: 2500, fan: 850, system: 220 },
    { airflow: 4000, fan: 720, system: 460 },
    { airflow: 5500, fan: 560, system: 760 },
    { airflow: 7000, fan: 350, system: 1150 },
  ];

  const costData = design
    ? [
        { name: "Material", value: design.bom.material },
        { name: "Fabrication", value: design.bom.fabrication },
        { name: "Installation", value: design.bom.installation },
        { name: "Overhead", value: design.bom.overhead },
        { name: "Profit", value: design.bom.profit },
      ]
    : [];

  const psychData = design?.psychrometrics?.processPoints || [];
  const pressureData = design?.pressureCascade || [];
  const colors = ["#e00000", "#111111", "#777777", "#0066ff", "#00a86b"];

  return (
    <div className="finalOS">
      <header className="finalHeader">
        <div>
          <h1>Apfel Globus Engineering OS</h1>
          <p>Automatic HVAC • AHU • Cleanroom Design Platform</p>
        </div>
        <button onClick={generateDesign}>Generate Complete Design</button>
      </header>

      <div className="finalGrid">
        <aside className="finalInput">
          <h2>Project Wizard</h2>

          <label>Application</label>
          <select value={input.application} onChange={(e) => update("application", e.target.value)}>
            <option>Pharma Cleanroom</option>
            <option>Pharma Machine AHU</option>
            <option>Office HVAC</option>
            <option>Commercial Room</option>
            <option>Warehouse</option>
            <option>Hospital HVAC</option>
          </select>

          <label>Length m</label>
          <input type="number" value={input.length} onChange={(e) => update("length", e.target.value)} />

          <label>Width m</label>
          <input type="number" value={input.width} onChange={(e) => update("width", e.target.value)} />

          <label>Height m</label>
          <input type="number" value={input.height} onChange={(e) => update("height", e.target.value)} />

          <h3>Advanced Override</h3>

          <input type="number" placeholder="ACH optional" onChange={(e) => update("ach", e.target.value)} />
          <input type="number" placeholder="Temperature °C optional" onChange={(e) => update("temperature", e.target.value)} />
          <input type="number" placeholder="RH % optional" onChange={(e) => update("rh", e.target.value)} />
          <input type="number" placeholder="Pressure Pa optional" onChange={(e) => update("pressure", e.target.value)} />
          <input type="number" placeholder="People optional" onChange={(e) => update("people", e.target.value)} />
          <input type="number" placeholder="Equipment Load W optional" onChange={(e) => update("equipmentLoadW", e.target.value)} />
          <input type="number" placeholder="Outside DBT °C optional" onChange={(e) => update("outsideDBT", e.target.value)} />
          <input type="number" placeholder="Outside RH % optional" onChange={(e) => update("outsideRH", e.target.value)} />
        </aside>

        <main className="finalOutput">
          {!design && (
            <section className="emptyState">
              <h2>Ready for Auto Design</h2>
              <p>Enter room size and application, then generate complete HVAC/AHU design.</p>
            </section>
          )}

          {design && (
            <>
              <section className="kpiGrid">
                <div><span>Class</span><strong>{design.designBasis.cleanroomClass}</strong></div>
                <div><span>Airflow</span><strong>{design.airflow.supplyCMH.toFixed(0)} CMH</strong></div>
                <div><span>Coil</span><strong>{design.coil.capacityTR.toFixed(2)} TR</strong></div>
                <div><span>Fan</span><strong>{design.fan.motorHP} HP</strong></div>
                <div><span>Duct</span><strong>{design.duct.mainDuctDiaMM.toFixed(0)} mm</strong></div>
                <div><span>Price</span><strong>₹{design.bom.selling}</strong></div>
              </section>

              <section className="standardPanel">
                <h2>Design Basis</h2>
                <p><b>Application:</b> {design.designBasis.application}</p>
                <p><b>Class:</b> {design.designBasis.cleanroomClass}</p>
                <p><b>ACH:</b> {design.designBasis.ach}</p>
                <p><b>Temperature/RH:</b> {design.designBasis.temperature}°C / {design.designBasis.rh}%</p>
                <p><b>Pressure:</b> +{design.designBasis.pressure} Pa</p>
                <p><b>Filter Train:</b> {design.designBasis.filterTrain}</p>
              </section>

              <section className="drawingPanel">
                <h2>Auto 2D Cleanroom Layout</h2>
                <svg viewBox="0 0 1000 420">
                  <rect x="70" y="60" width="820" height="280" fill="#fff" stroke="#111" strokeWidth="4" />
                  <rect x="110" y="100" width="270" height="160" fill="#f5f5f5" stroke="#111" strokeWidth="3" />
                  <text x="150" y="180" fontSize="22">{design.designBasis.application}</text>
                  <rect x="440" y="100" width="170" height="160" fill="#e8f3ff" stroke="#111" strokeWidth="3" />
                  <text x="485" y="180" fontSize="22">Airlock</text>
                  <rect x="670" y="100" width="170" height="160" fill="#e8ffe8" stroke="#111" strokeWidth="3" />
                  <text x="710" y="180" fontSize="22">Corridor</text>
                  <line x1="160" y1="305" x2="770" y2="305" stroke="#e00000" strokeWidth="7" />
                  <text x="390" y="295" fill="#e00000" fontSize="20">Supply Duct</text>
                  <circle cx="220" cy="305" r="22" fill="#0066ff" />
                  <circle cx="500" cy="305" r="22" fill="#0066ff" />
                  <circle cx="760" cy="305" r="22" fill="#0066ff" />
                </svg>
              </section>

              <section className="drawingPanel">
                <h2>Auto AHU Section</h2>
                <svg viewBox="0 0 1000 300">
                  <rect x="70" y="85" width="840" height="130" fill="#fff" stroke="#111" strokeWidth="4" />
                  <rect x="110" y="110" width="100" height="80" fill="#ddd" stroke="#111" />
                  <text x="125" y="155">G4</text>
                  <rect x="240" y="110" width="100" height="80" fill="#eee" stroke="#111" />
                  <text x="255" y="155">F8</text>
                  <rect x="370" y="110" width="130" height="80" fill="#cce5ff" stroke="#111" />
                  <text x="400" y="155">Coil</text>
                  <circle cx="590" cy="150" r="45" fill="#ffe6cc" stroke="#111" />
                  <text x="570" y="157">Fan</text>
                  <rect x="700" y="110" width="120" height="80" fill="#e6ffe6" stroke="#111" />
                  <text x="735" y="155">Motor</text>
                  <text x="280" y="255" fontSize="18">
                    AHU: {design.ahu.length}L × {design.ahu.width}W × {design.ahu.height}H mm
                  </text>
                </svg>
              </section>

              <section className="chartGrid">
                <div className="chartCard">
                  <h2>Fan Curve + System Curve</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={fanCurve}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="airflow" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line dataKey="fan" stroke="#e00000" strokeWidth={3} />
                      <Line dataKey="system" stroke="#0066ff" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Psychrometric Process</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart data={psychData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="dbt" />
                      <YAxis dataKey="humidityRatio" />
                      <Tooltip />
                      <Legend />
                      <Line dataKey="humidityRatio" stroke="#e00000" strokeWidth={3} name="Humidity Ratio g/kg" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Pressure Cascade</h2>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={pressureData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="area" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="pressurePa" fill="#e00000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>BOM Cost Split</h2>
                  <ResponsiveContainer width="100%" height={260}>
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
                <h2>Engineering Calculation Summary</h2>
                <table>
                  <tbody>
                    <tr><td>Room Volume</td><td>{design.room.volume.toFixed(2)} m³</td></tr>
                    <tr><td>Supply Air</td><td>{design.airflow.supplyCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Fresh Air</td><td>{design.airflow.freshAirCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Return Air</td><td>{design.airflow.returnAirCMH.toFixed(0)} CMH</td></tr>
                    <tr><td>Total Static Pressure</td><td>{design.pressure.totalStaticPa.toFixed(0)} Pa</td></tr>
                    <tr><td>Fan Power</td><td>{design.fan.powerKW.toFixed(2)} kW</td></tr>
                    <tr><td>Motor</td><td>{design.fan.motorHP} HP</td></tr>
                    <tr><td>Coil Load</td><td>{design.coil.capacityTR.toFixed(2)} TR</td></tr>
                    <tr><td>Latent Load</td><td>{design.coil.latentKW.toFixed(2)} kW</td></tr>
                    <tr><td>Moisture Removal</td><td>{design.coil.moistureRemovalKgHr.toFixed(2)} kg/hr</td></tr>
                    <tr><td>Recovery Time</td><td>{design.recovery.recoveryEstimate.recovery.valid ? design.recovery.recoveryEstimate.recovery.recoveryMinutes.toFixed(2) : "-"} min</td></tr>
                  </tbody>
                </table>
              </section>

              <section className="tablePanel">
                <h2>BOM + Costing</h2>
                <table>
                  <thead>
                    <tr><th>Item</th><th>Specification</th><th>Qty</th><th>Rate ₹</th></tr>
                  </thead>
                  <tbody>
                    {design.bom.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.item}</td>
                        <td>{item.specification}</td>
                        <td>{item.qty}</td>
                        <td>{item.rate.toFixed(0)}</td>
                      </tr>
                    ))}
                    <tr><td colSpan="3"><b>Selling Price</b></td><td><b>₹{design.bom.selling}</b></td></tr>
                  </tbody>
                </table>
              </section>

              <section className="warningPanel">
                <h2>Warnings + Validation Notes</h2>
                {design.warnings.map((w, i) => <p key={i}>⚠ {w}</p>)}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default FinalEngineeringOS;