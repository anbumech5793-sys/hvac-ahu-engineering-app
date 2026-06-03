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
  selectFanFromCatalog,
  getFanCatalog,
} from "./fanCatalogEngine";

function FanCatalogDashboard() {
  const [input, setInput] = useState({
    airflowCMH: 4500,
    pressurePa: 950,
  });

  const [result, setResult] = useState(null);

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function calculateFan() {
    const fanResult = selectFanFromCatalog({
      airflowCMH: Number(input.airflowCMH),
      pressurePa: Number(input.pressurePa),
    });

    setResult(fanResult);
  }

  const catalog = getFanCatalog();

  return (
    <div className="fanCatalogApp">
      <header className="fanCatalogHeader">
        <div>
          <h1>Fan Catalog Selection Engine</h1>
          <p>
            Select fan model from airflow, static pressure, motor HP,
            efficiency and fan curve
          </p>
        </div>

        <button onClick={calculateFan}>
          Select Fan
        </button>
      </header>

      <div className="fanCatalogGrid">
        <aside className="fanInputPanel">
          <h2>Required Duty</h2>

          <label>Airflow CMH</label>
          <input
            type="number"
            value={input.airflowCMH}
            onChange={(e) => update("airflowCMH", e.target.value)}
          />

          <label>Static Pressure Pa</label>
          <input
            type="number"
            value={input.pressurePa}
            onChange={(e) => update("pressurePa", e.target.value)}
          />

          <div className="fanNote">
            <strong>Selection Logic</strong>
            <p>
              Software selects the nearest catalog fan that can meet or exceed
              required airflow and pressure.
            </p>
          </div>
        </aside>

        <main className="fanOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Fan Selection</h2>
              <p>
                Enter required airflow and static pressure, then click Select Fan.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Selected Model</span>
                  <strong>{result.selectedFan.model}</strong>
                </div>

                <div>
                  <span>Fan Type</span>
                  <strong>{result.selectedFan.type}</strong>
                </div>

                <div>
                  <span>Motor</span>
                  <strong>{result.selectedFan.motorHP} HP</strong>
                </div>

                <div>
                  <span>Efficiency</span>
                  <strong>{result.selectedFan.efficiency}%</strong>
                </div>

                <div>
                  <span>Impeller</span>
                  <strong>{result.selectedFan.impellerDiaMM} mm</strong>
                </div>

                <div>
                  <span>Noise</span>
                  <strong>{result.selectedFan.noiseDB} dB</strong>
                </div>
              </section>

              <section className="standardPanel">
                <h2>Selected Fan Duty</h2>

                <p>
                  <b>Required Airflow:</b>{" "}
                  {result.required.airflowCMH.toFixed(0)} CMH
                </p>

                <p>
                  <b>Required Pressure:</b>{" "}
                  {result.required.pressurePa.toFixed(0)} Pa
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
                  <b>Airflow Utilization:</b>{" "}
                  {result.utilization.airflowPercent}%
                </p>

                <p>
                  <b>Pressure Utilization:</b>{" "}
                  {result.utilization.pressurePercent}%
                </p>
              </section>

              <section className="chartCard">
                <h2>Fan Curve + Duty Point</h2>

                <ResponsiveContainer width="100%" height={360}>
                  <LineChart>
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis
                      type="number"
                      dataKey="airflow"
                      domain={[0, "dataMax + 1000"]}
                      label={{
                        value: "Airflow CMH",
                        position: "insideBottom",
                        offset: -5,
                      }}
                    />

                    <YAxis
                      type="number"
                      dataKey="pressure"
                      domain={[0, "dataMax + 200"]}
                      label={{
                        value: "Pressure Pa",
                        angle: -90,
                        position: "insideLeft",
                      }}
                    />

                    <Tooltip />
                    <Legend />

                    <Line
                      data={result.fanCurve}
                      type="monotone"
                      dataKey="pressure"
                      stroke="#e00000"
                      strokeWidth={4}
                      dot
                      name="Fan Curve"
                    />

                    <Scatter
                      data={result.dutyPoint}
                      dataKey="pressure"
                      fill="#111111"
                      name="Duty Point"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Fan Selection Warnings</h2>

                  {result.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}

          <section className="tablePanel">
            <h2>Fan Catalog Table</h2>

            <table>
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Type</th>
                  <th>Airflow</th>
                  <th>Pressure</th>
                  <th>RPM</th>
                  <th>Motor</th>
                  <th>Efficiency</th>
                  <th>Impeller</th>
                  <th>Noise</th>
                </tr>
              </thead>

              <tbody>
                {catalog.map((fan) => (
                  <tr key={fan.model}>
                    <td>{fan.model}</td>
                    <td>{fan.type}</td>
                    <td>{fan.airflowCMH} CMH</td>
                    <td>{fan.pressurePa} Pa</td>
                    <td>{fan.rpm}</td>
                    <td>{fan.motorHP} HP</td>
                    <td>{fan.efficiency}%</td>
                    <td>{fan.impellerDiaMM} mm</td>
                    <td>{fan.noiseDB} dB</td>
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

export default FanCatalogDashboard;