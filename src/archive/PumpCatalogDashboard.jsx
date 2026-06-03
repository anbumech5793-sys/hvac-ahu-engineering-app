import { useState } from "react";
import {
  LineChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  selectPumpFromCatalog,
  getPumpCatalog,
} from "./pumpCatalogEngine";

function PumpCatalogDashboard() {
  const [input, setInput] = useState({
    flowLPM: 60,
    headM: 15,
  });

  const [result, setResult] = useState(null);

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function calculatePump() {
    const pumpResult = selectPumpFromCatalog({
      flowLPM: Number(input.flowLPM),
      headM: Number(input.headM),
    });

    setResult(pumpResult);
  }

  const catalog = getPumpCatalog();

  return (
    <div className="pumpApp">
      <header className="pumpHeader">
        <div>
          <h1>Pump Catalog Selection Engine</h1>
          <p>
            CHW pump selection • flow • head • motor HP • efficiency • pump curve
          </p>
        </div>

        <button onClick={calculatePump}>Select Pump</button>
      </header>

      <div className="pumpGrid">
        <aside className="pumpInputPanel">
          <h2>Required Duty</h2>

          <label>Flow LPM</label>
          <input
            type="number"
            value={input.flowLPM}
            onChange={(e) => update("flowLPM", e.target.value)}
          />

          <label>Head m</label>
          <input
            type="number"
            value={input.headM}
            onChange={(e) => update("headM", e.target.value)}
          />

          <div className="pumpNote">
            <strong>Selection Logic</strong>
            <p>
              Software selects the nearest catalog pump that can meet or exceed
              required flow and head.
            </p>
          </div>
        </aside>

        <main className="pumpOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Pump Selection</h2>
              <p>
                Enter chilled water flow and pump head, then click Select Pump.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Selected Model</span>
                  <strong>{result.selectedPump.model}</strong>
                </div>

                <div>
                  <span>Pump Type</span>
                  <strong>{result.selectedPump.type}</strong>
                </div>

                <div>
                  <span>Motor</span>
                  <strong>{result.selectedPump.motorHP} HP</strong>
                </div>

                <div>
                  <span>Efficiency</span>
                  <strong>{result.selectedPump.efficiency}%</strong>
                </div>

                <div>
                  <span>RPM</span>
                  <strong>{result.selectedPump.rpm}</strong>
                </div>

                <div>
                  <span>Noise</span>
                  <strong>{result.selectedPump.noiseDB} dB</strong>
                </div>
              </section>

              <section className="standardPanel">
                <h2>Selected Pump Duty</h2>

                <p>
                  <b>Required Flow:</b>{" "}
                  {result.required.flowLPM.toFixed(0)} LPM
                </p>

                <p>
                  <b>Required Head:</b>{" "}
                  {result.required.headM.toFixed(1)} m
                </p>

                <p>
                  <b>Calculated Power:</b>{" "}
                  {result.required.calculatedKW.toFixed(2)} kW /{" "}
                  {result.required.calculatedHP.toFixed(2)} HP
                </p>

                <p>
                  <b>Selected Motor Required:</b>{" "}
                  {result.required.selectedMotorHP} HP
                </p>

                <p>
                  <b>Flow Utilization:</b>{" "}
                  {result.utilization.flowPercent}%
                </p>

                <p>
                  <b>Head Utilization:</b>{" "}
                  {result.utilization.headPercent}%
                </p>

                <p>
                  <b>Suction / Discharge:</b>{" "}
                  {result.selectedPump.suctionSize} /{" "}
                  {result.selectedPump.dischargeSize}
                </p>
              </section>

              <section className="chartCard">
                <h2>Pump Curve + Duty Point</h2>

                <ResponsiveContainer width="100%" height={360}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      dataKey="flow"
                      domain={[0, "dataMax + 100"]}
                      label={{
                        value: "Flow LPM",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />

                    <YAxis
                      type="number"
                      dataKey="head"
                      domain={[0, "dataMax + 10"]}
                      label={{
                        value: "Head m",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />

                    <Tooltip />
                    <Legend />

                    <Line
                      data={result.pumpCurve}
                      type="monotone"
                      dataKey="head"
                      stroke="#e00000"
                      strokeWidth={4}
                      dot
                      name="Pump Curve"
                    />

                    <Scatter
                      data={result.dutyPoint}
                      dataKey="head"
                      fill="#111111"
                      name="Duty Point"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Pump Selection Warnings</h2>

                  {result.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}

          <section className="tablePanel">
            <h2>Pump Catalog Table</h2>

            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Type</th>
                  <th>Flow</th>
                  <th>Head</th>
                  <th>Motor</th>
                  <th>Efficiency</th>
                  <th>RPM</th>
                  <th>Suction</th>
                  <th>Discharge</th>
                  <th>Noise</th>
                </tr>
              </thead>

              <tbody>
                {catalog.map((pump) => (
                  <tr key={pump.model}>
                    <td>{pump.model}</td>
                    <td>{pump.type}</td>
                    <td>{pump.flowLPM} LPM</td>
                    <td>{pump.headM} m</td>
                    <td>{pump.motorHP} HP</td>
                    <td>{pump.efficiency}%</td>
                    <td>{pump.rpm}</td>
                    <td>{pump.suctionSize}</td>
                    <td>{pump.dischargeSize}</td>
                    <td>{pump.noiseDB} dB</td>
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

export default PumpCatalogDashboard;