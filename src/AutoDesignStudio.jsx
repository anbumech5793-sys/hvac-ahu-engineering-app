import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  industryTemplates,
  getIndustryRoomBasis,
} from "./industryWizard";

function AutoDesignStudio() {
  const [data, setData] = useState({
    industry: "Pharma",
    roomTemplate: "Granulation",
  });

  const [result, setResult] = useState(null);

  function update(key, value) {
    setData({
      ...data,
      [key]: value,
    });
  }

  function n(key) {
    return Number(data[key] || 0);
  }

  function autoDesign() {
    const length = n("length");
    const width = n("width");
    const height = n("height");

    const volume = length * width * height;

    const basis = getIndustryRoomBasis(
      data.industry,
      data.roomTemplate
    );

    const airflow = volume * basis.ach;
    const freshAir = airflow * 0.2;

    const peopleLoad = n("people") * 150;
    const equipmentLoad = n("equipment");
    const lightingLoad = length * width * 15;

    const totalHeatW =
      peopleLoad + equipmentLoad + lightingLoad;

    const tr = totalHeatW / 3517;

    const coilKW = airflow * 21 * 0.000335;
    const coilTR = coilKW / 3.517;

    const staticPressure = 850;

    const fanKW =
      ((airflow / 3600) * staticPressure) /
      (1000 * 0.65);

    const fanHP = fanKW / 0.746;

    const ductVelocity = 8;
    const ductArea = airflow / (3600 * ductVelocity);
    const ductDia =
      Math.sqrt((4 * ductArea) / Math.PI) * 1000;

    const hepaQty = Math.ceil(airflow / 1000);

    const ahuWidth = Math.ceil(Math.sqrt(airflow) * 25);
    const ahuHeight = Math.ceil(ahuWidth * 0.65);
    const ahuLength = 2800 + hepaQty * 250;

    const materialCost =
      airflow * 20 +
      hepaQty * 6500 +
      coilTR * 18000 +
      fanHP * 12000;

    const fabrication = materialCost * 0.18;
    const overhead = materialCost * 0.12;
    const profit =
      (materialCost + fabrication + overhead) * 0.25;

    const selling =
      materialCost + fabrication + overhead + profit;

    setResult({
      industry: data.industry,
      roomType: data.roomTemplate,
      isoClass: basis.isoClass,
      ach: basis.ach,
      pressure: basis.pressure,
      filter: basis.filter,
      temp: basis.temp,
      rh: basis.rh,
      volume,
      airflow,
      freshAir,
      peopleLoad,
      equipmentLoad,
      lightingLoad,
      totalHeatW,
      tr,
      coilKW,
      coilTR,
      fanKW,
      fanHP,
      ductDia,
      hepaQty,
      ahuWidth,
      ahuHeight,
      ahuLength,
      materialCost,
      fabrication,
      overhead,
      profit,
      selling,
    });
  }

  const roomOptions = Object.keys(
    industryTemplates[data.industry]?.rooms || {}
  );

  const fanCurve = [
    { airflow: 1000, fan: 950, system: 80 },
    { airflow: 2500, fan: 850, system: 220 },
    { airflow: 4000, fan: 720, system: 460 },
    { airflow: 5500, fan: 560, system: 760 },
    { airflow: 7000, fan: 350, system: 1150 },
  ];

  const pressureData = result
    ? [
        { area: "Corridor", pa: 5 },
        { area: "Airlock", pa: 10 },
        { area: result.roomType, pa: result.pressure },
      ]
    : [];

  const costData = result
    ? [
        { name: "Material", value: result.materialCost },
        { name: "Fabrication", value: result.fabrication },
        { name: "Overhead", value: result.overhead },
        { name: "Profit", value: result.profit },
      ]
    : [];

  const colors = ["#e00000", "#111111", "#666666", "#0066ff"];

  return (
    <div className="autoStudio">
      <header className="autoHeader">
        <div>
          <h1>Apfel Globus Auto HVAC Design Studio</h1>
          <p>
            Industry template → automatic cleanroom HVAC + AHU design output
          </p>
        </div>

        <button onClick={autoDesign}>
          Generate Auto Design
        </button>
      </header>

      <div className="autoLayout">
        <aside className="wizardPanel">
          <h2>Project Wizard</h2>

          <input
            placeholder="Project Name"
            onChange={(e) => update("project", e.target.value)}
          />

          <input
            placeholder="Client Name"
            onChange={(e) => update("client", e.target.value)}
          />

          <h3>Industry Template</h3>

          <select
            value={data.industry}
            onChange={(e) => {
              const selectedIndustry = e.target.value;
              const firstRoom = Object.keys(
                industryTemplates[selectedIndustry].rooms
              )[0];

              setData({
                ...data,
                industry: selectedIndustry,
                roomTemplate: firstRoom,
              });
            }}
          >
            {Object.keys(industryTemplates).map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>

          <select
            value={data.roomTemplate}
            onChange={(e) =>
              update("roomTemplate", e.target.value)
            }
          >
            {roomOptions.map((room) => (
              <option key={room} value={room}>
                {room}
              </option>
            ))}
          </select>

          <h3>Room Size</h3>

          <input
            type="number"
            placeholder="Length m"
            onChange={(e) => update("length", e.target.value)}
          />

          <input
            type="number"
            placeholder="Width m"
            onChange={(e) => update("width", e.target.value)}
          />

          <input
            type="number"
            placeholder="Height m"
            onChange={(e) => update("height", e.target.value)}
          />

          <h3>Process Data</h3>

          <input
            type="number"
            placeholder="People Count"
            onChange={(e) => update("people", e.target.value)}
          />

          <input
            type="number"
            placeholder="Equipment Load W"
            onChange={(e) => update("equipment", e.target.value)}
          />

          <div className="wizardNote">
            <strong>Auto-selected by software:</strong>
            <p>
              ISO class, ACH, pressure, filter train, temperature,
              RH, airflow, AHU size, fan, coil, duct, BOM and cost.
            </p>
          </div>
        </aside>

        <main className="designPanel">
          <section className="heroResult">
            <h2>Auto Design Output</h2>

            {!result && (
              <p>
                Select industry, room template, enter room size and click
                Generate Auto Design.
              </p>
            )}

            {result && (
              <div className="resultTiles">
                <div>
                  <span>Industry</span>
                  <strong>{result.industry}</strong>
                </div>

                <div>
                  <span>Room</span>
                  <strong>{result.roomType}</strong>
                </div>

                <div>
                  <span>Class</span>
                  <strong>{result.isoClass}</strong>
                </div>

                <div>
                  <span>ACH</span>
                  <strong>{result.ach}</strong>
                </div>

                <div>
                  <span>Airflow</span>
                  <strong>{result.airflow.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Pressure</span>
                  <strong>+{result.pressure} Pa</strong>
                </div>

                <div>
                  <span>Coil</span>
                  <strong>{result.coilTR.toFixed(2)} TR</strong>
                </div>

                <div>
                  <span>Fan</span>
                  <strong>{result.fanHP.toFixed(2)} HP</strong>
                </div>

                <div>
                  <span>HEPA</span>
                  <strong>{result.hepaQty} Nos</strong>
                </div>

                <div>
                  <span>Price</span>
                  <strong>₹{result.selling.toFixed(0)}</strong>
                </div>
              </div>
            )}
          </section>

          {result && (
            <>
              <section className="autoDrawing">
                <h2>Automatic 2D Cleanroom HVAC Layout</h2>

                <svg viewBox="0 0 1000 420">
                  <rect
                    x="70"
                    y="60"
                    width="820"
                    height="280"
                    fill="#fff"
                    stroke="#111"
                    strokeWidth="4"
                  />

                  <rect
                    x="110"
                    y="100"
                    width="260"
                    height="160"
                    fill="#f5f5f5"
                    stroke="#111"
                    strokeWidth="3"
                  />

                  <text x="150" y="180" fontSize="22">
                    {result.roomType}
                  </text>

                  <rect
                    x="430"
                    y="100"
                    width="180"
                    height="160"
                    fill="#e8f3ff"
                    stroke="#111"
                    strokeWidth="3"
                  />

                  <text x="470" y="180" fontSize="22">
                    Airlock
                  </text>

                  <rect
                    x="670"
                    y="100"
                    width="170"
                    height="160"
                    fill="#e8ffe8"
                    stroke="#111"
                    strokeWidth="3"
                  />

                  <text x="710" y="180" fontSize="22">
                    Corridor
                  </text>

                  <line
                    x1="160"
                    y1="300"
                    x2="770"
                    y2="300"
                    stroke="#e00000"
                    strokeWidth="7"
                  />

                  <text x="390" y="290" fill="#e00000" fontSize="20">
                    Supply Duct
                  </text>

                  <circle cx="220" cy="300" r="22" fill="#0066ff" />
                  <circle cx="500" cy="300" r="22" fill="#0066ff" />
                  <circle cx="760" cy="300" r="22" fill="#0066ff" />
                </svg>
              </section>

              <section className="autoDrawing">
                <h2>Automatic AHU Section</h2>

                <svg viewBox="0 0 1000 300">
                  <rect
                    x="70"
                    y="85"
                    width="840"
                    height="130"
                    fill="#fff"
                    stroke="#111"
                    strokeWidth="4"
                  />

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

                  <line x1="25" y1="150" x2="70" y2="150" stroke="#e00000" strokeWidth="6" />
                  <line x1="910" y1="150" x2="970" y2="150" stroke="#e00000" strokeWidth="6" />

                  <text x="300" y="255" fontSize="18">
                    AHU Size: {result.ahuLength} L × {result.ahuWidth} W × {result.ahuHeight} H mm
                  </text>
                </svg>
              </section>

              <section className="auto3D">
                <h2>Automatic 3D AHU Concept</h2>

                <div className="auto3DBox">
                  <div className="part3d pre">Pre Filter</div>
                  <div className="part3d fine">Fine Filter</div>
                  <div className="part3d coil">Coil</div>
                  <div className="part3d fan">Fan</div>
                  <div className="part3d motor">Motor</div>
                </div>
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
                      <Line
                        dataKey="fan"
                        stroke="#e00000"
                        strokeWidth={3}
                        name="Fan Curve"
                      />
                      <Line
                        dataKey="system"
                        stroke="#0066ff"
                        strokeWidth={3}
                        name="System Curve"
                      />
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
                      <Bar dataKey="pa" fill="#e00000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>Cost Split</h2>

                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie
                        data={costData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={90}
                        label
                      >
                        {costData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={colors[i % colors.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="specPanel">
                <h2>Auto Generated Standard Specification</h2>

                <table>
                  <tbody>
                    <tr>
                      <td>Industry</td>
                      <td>{result.industry}</td>
                    </tr>

                    <tr>
                      <td>Room Type</td>
                      <td>{result.roomType}</td>
                    </tr>

                    <tr>
                      <td>Cleanroom Class</td>
                      <td>{result.isoClass}</td>
                    </tr>

                    <tr>
                      <td>Temperature</td>
                      <td>{result.temp} °C</td>
                    </tr>

                    <tr>
                      <td>Relative Humidity</td>
                      <td>{result.rh}%</td>
                    </tr>

                    <tr>
                      <td>Filter Train</td>
                      <td>{result.filter}</td>
                    </tr>

                    <tr>
                      <td>Room Volume</td>
                      <td>{result.volume.toFixed(2)} m³</td>
                    </tr>

                    <tr>
                      <td>Airflow</td>
                      <td>{result.airflow.toFixed(0)} CMH</td>
                    </tr>

                    <tr>
                      <td>Fresh Air</td>
                      <td>{result.freshAir.toFixed(0)} CMH</td>
                    </tr>

                    <tr>
                      <td>Heat Load</td>
                      <td>{result.tr.toFixed(2)} TR</td>
                    </tr>

                    <tr>
                      <td>Coil Load</td>
                      <td>{result.coilTR.toFixed(2)} TR</td>
                    </tr>

                    <tr>
                      <td>Fan Power</td>
                      <td>
                        {result.fanKW.toFixed(2)} kW /{" "}
                        {result.fanHP.toFixed(2)} HP
                      </td>
                    </tr>

                    <tr>
                      <td>Duct Diameter</td>
                      <td>{result.ductDia.toFixed(0)} mm</td>
                    </tr>

                    <tr>
                      <td>Estimated Selling Price</td>
                      <td>₹{result.selling.toFixed(0)}</td>
                    </tr>
                  </tbody>
                </table>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default AutoDesignStudio;