import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  selectCoolingCoil,
  getCoilCatalog,
} from "./coilCatalogEngine";

function CoilCatalogDashboard() {
  const [input, setInput] = useState({
    requiredTR: 5,
    airflowCMH: 5000,
    chwDeltaT: 5,
    pipeLengthM: 30,
  });

  const [result, setResult] = useState(null);

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function calculateCoil() {
    const coilResult = selectCoolingCoil({
      requiredTR: Number(input.requiredTR),
      airflowCMH: Number(input.airflowCMH),
      chwDeltaT: Number(input.chwDeltaT),
      pipeLengthM: Number(input.pipeLengthM),
    });

    setResult(coilResult);
  }

  const catalog = getCoilCatalog();

  return (
    <div className="coilApp">
      <header className="coilHeader">
        <div>
          <h1>Coil Catalog + CHW Piping Engine</h1>
          <p>
            Cooling coil selection • CHW flow • pipe size • valve size • pump head
          </p>
        </div>

        <button onClick={calculateCoil}>
          Select Coil
        </button>
      </header>

      <div className="coilGrid">
        <aside className="coilInputPanel">
          <h2>Coil Inputs</h2>

          <label>Required Cooling Load TR</label>
          <input
            type="number"
            value={input.requiredTR}
            onChange={(e) => update("requiredTR", e.target.value)}
          />

          <label>Airflow CMH</label>
          <input
            type="number"
            value={input.airflowCMH}
            onChange={(e) => update("airflowCMH", e.target.value)}
          />

          <label>CHW ΔT °C</label>
          <input
            type="number"
            value={input.chwDeltaT}
            onChange={(e) => update("chwDeltaT", e.target.value)}
          />

          <label>Pipe Length m</label>
          <input
            type="number"
            value={input.pipeLengthM}
            onChange={(e) => update("pipeLengthM", e.target.value)}
          />

          <div className="coilNote">
            <strong>Selection Logic</strong>
            <p>
              Software selects the nearest coil model that can meet or exceed
              required TR and airflow, then calculates CHW flow, pipe size,
              valve size and pump head.
            </p>
          </div>
        </aside>

        <main className="coilOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Coil Selection</h2>
              <p>
                Enter required cooling load, airflow and chilled water data,
                then click Select Coil.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Selected Coil</span>
                  <strong>{result.selectedCoil.model}</strong>
                </div>

                <div>
                  <span>Capacity</span>
                  <strong>{result.selectedCoil.capacityTR} TR</strong>
                </div>

                <div>
                  <span>Rows</span>
                  <strong>{result.selectedCoil.rows}</strong>
                </div>

                <div>
                  <span>CHW Flow</span>
                  <strong>{result.chilledWater.flowLPM} LPM</strong>
                </div>

                <div>
                  <span>Pipe</span>
                  <strong>{result.chilledWater.pipeSize}</strong>
                </div>

                <div>
                  <span>Pump Head</span>
                  <strong>{result.chilledWater.selectedPumpHeadM} m</strong>
                </div>
              </section>

              <section className="standardPanel">
                <h2>Selected Coil Details</h2>

                <p><b>Model:</b> {result.selectedCoil.model}</p>
                <p><b>Face Size:</b> {result.selectedCoil.faceWidthMM} × {result.selectedCoil.faceHeightMM} mm</p>
                <p><b>Airflow Rating:</b> {result.selectedCoil.airflowCMH} CMH</p>
                <p><b>Air Pressure Drop:</b> {result.selectedCoil.airPressureDropPa} Pa</p>
                <p><b>Water Pressure Drop:</b> {result.selectedCoil.waterPressureDropKPa} kPa</p>
                <p><b>Valve Size:</b> {result.chilledWater.valveSize}</p>
                <p><b>Capacity Utilization:</b> {result.utilization.capacityPercent}%</p>
                <p><b>Airflow Utilization:</b> {result.utilization.airflowPercent}%</p>
              </section>

              <section className="chartGrid">
                <div className="chartCard">
                  <h2>Coil Performance Curve</h2>

                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={result.coilPerformanceChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="loadPercent" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        dataKey="capacityTR"
                        stroke="#e00000"
                        strokeWidth={4}
                        name="Capacity TR"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="chartCard">
                  <h2>CHW Pump Head Breakdown</h2>

                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={result.pumpHeadChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="item" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="head"
                        fill="#0066ff"
                        name="Head m"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>

              <section className="tablePanel">
                <h2>Chilled Water Piping Result</h2>

                <table>
                  <tbody>
                    <tr>
                      <td>CHW Flow</td>
                      <td>{result.chilledWater.flowLPM} LPM</td>
                    </tr>

                    <tr>
                      <td>Pipe Size</td>
                      <td>{result.chilledWater.pipeSize}</td>
                    </tr>

                    <tr>
                      <td>Valve Size</td>
                      <td>{result.chilledWater.valveSize}</td>
                    </tr>

                    <tr>
                      <td>Pipe Head Loss</td>
                      <td>{result.chilledWater.pipeHeadLossM} m</td>
                    </tr>

                    <tr>
                      <td>Coil Water Head</td>
                      <td>{result.chilledWater.coilWaterHeadM} m</td>
                    </tr>

                    <tr>
                      <td>Total Pump Head</td>
                      <td>{result.chilledWater.totalPumpHeadM} m</td>
                    </tr>

                    <tr>
                      <td>Selected Pump Head</td>
                      <td>{result.chilledWater.selectedPumpHeadM} m</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Coil Selection Warnings</h2>

                  {result.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}

          <section className="tablePanel">
            <h2>Coil Catalog Table</h2>

            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>TR</th>
                  <th>Rows</th>
                  <th>Airflow</th>
                  <th>Face Size</th>
                  <th>Air PD</th>
                  <th>Water PD</th>
                  <th>Pipe</th>
                  <th>Valve</th>
                </tr>
              </thead>

              <tbody>
                {catalog.map((coil) => (
                  <tr key={coil.model}>
                    <td>{coil.model}</td>
                    <td>{coil.capacityTR}</td>
                    <td>{coil.rows}</td>
                    <td>{coil.airflowCMH} CMH</td>
                    <td>{coil.faceWidthMM} × {coil.faceHeightMM}</td>
                    <td>{coil.airPressureDropPa} Pa</td>
                    <td>{coil.waterPressureDropKPa} kPa</td>
                    <td>{coil.pipeSize}</td>
                    <td>{coil.valveSize}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    </div>
  );
}

export default CoilCatalogDashboard;