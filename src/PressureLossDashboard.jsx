import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  calculatePressureLoss,
  calculateFanPowerFromPressure,
} from "./pressureLossEngine";

function PressureLossDashboard() {
  const [input, setInput] = useState({
    airflowCMH: 2250,
    velocityMS: 8,
    straightLengthM: 15,
    elbows: 3,
    reducers: 1,
    tees: 1,
    dampers: 1,
    preFilterPa: 80,
    fineFilterPa: 120,
    coilPa: 150,
    hepaPa: 180,
    diffuserPa: 35,
    terminalPa: 50,
    safetyMarginPa: 100,
    fanEfficiency: 65,
  });

  const [result, setResult] = useState(null);
  const [fanResult, setFanResult] = useState(null);

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function calculate() {
    const pressure = calculatePressureLoss(input);

    const fan = calculateFanPowerFromPressure({
      airflowCMH: input.airflowCMH,
      totalPressurePa: pressure.recommendedFanPressure,
      fanEfficiency: input.fanEfficiency,
    });

    setResult(pressure);
    setFanResult(fan);
  }

  return (
    <div className="pressureApp">
      <header className="pressureHeader">
        <div>
          <h1>Pressure Loss Engine</h1>
          <p>
            Section-by-section duct, fittings, filter, coil, HEPA and terminal pressure calculation
          </p>
        </div>

        <button onClick={calculate}>
          Calculate Pressure Loss
        </button>
      </header>

      <div className="pressureGrid">
        <aside className="pressureInputPanel">
          <h2>Pressure Inputs</h2>

          <label>Airflow CMH</label>
          <input
            type="number"
            value={input.airflowCMH}
            onChange={(e) => update("airflowCMH", e.target.value)}
          />

          <label>Duct Velocity m/s</label>
          <input
            type="number"
            value={input.velocityMS}
            onChange={(e) => update("velocityMS", e.target.value)}
          />

          <label>Straight Duct Length m</label>
          <input
            type="number"
            value={input.straightLengthM}
            onChange={(e) => update("straightLengthM", e.target.value)}
          />

          <h3>Fittings</h3>

          <label>Elbows Nos</label>
          <input
            type="number"
            value={input.elbows}
            onChange={(e) => update("elbows", e.target.value)}
          />

          <label>Reducers Nos</label>
          <input
            type="number"
            value={input.reducers}
            onChange={(e) => update("reducers", e.target.value)}
          />

          <label>Tees Nos</label>
          <input
            type="number"
            value={input.tees}
            onChange={(e) => update("tees", e.target.value)}
          />

          <label>Dampers Nos</label>
          <input
            type="number"
            value={input.dampers}
            onChange={(e) => update("dampers", e.target.value)}
          />

          <h3>Equipment Pressure</h3>

          <label>Pre Filter Pa</label>
          <input
            type="number"
            value={input.preFilterPa}
            onChange={(e) => update("preFilterPa", e.target.value)}
          />

          <label>Fine Filter Pa</label>
          <input
            type="number"
            value={input.fineFilterPa}
            onChange={(e) => update("fineFilterPa", e.target.value)}
          />

          <label>Cooling Coil Pa</label>
          <input
            type="number"
            value={input.coilPa}
            onChange={(e) => update("coilPa", e.target.value)}
          />

          <label>HEPA Pa</label>
          <input
            type="number"
            value={input.hepaPa}
            onChange={(e) => update("hepaPa", e.target.value)}
          />

          <label>Diffuser Pa</label>
          <input
            type="number"
            value={input.diffuserPa}
            onChange={(e) => update("diffuserPa", e.target.value)}
          />

          <label>Terminal Pa</label>
          <input
            type="number"
            value={input.terminalPa}
            onChange={(e) => update("terminalPa", e.target.value)}
          />

          <label>Safety Margin Pa</label>
          <input
            type="number"
            value={input.safetyMarginPa}
            onChange={(e) => update("safetyMarginPa", e.target.value)}
          />

          <label>Fan Efficiency %</label>
          <input
            type="number"
            value={input.fanEfficiency}
            onChange={(e) => update("fanEfficiency", e.target.value)}
          />
        </aside>

        <main className="pressureOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Pressure Loss Calculation</h2>
              <p>
                Enter airflow, duct route, fittings and equipment pressure drops,
                then calculate total static pressure.
              </p>
            </section>
          )}

          {result && fanResult && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Total Static</span>
                  <strong>{result.totalStaticPressure.toFixed(0)} Pa</strong>
                </div>

                <div>
                  <span>Recommended Fan Pressure</span>
                  <strong>{result.recommendedFanPressure} Pa</strong>
                </div>

                <div>
                  <span>Fan Power</span>
                  <strong>{fanResult.fanKW.toFixed(2)} kW</strong>
                </div>

                <div>
                  <span>Motor HP</span>
                  <strong>{fanResult.selectedMotorHP} HP</strong>
                </div>
              </section>

              <section className="chartCard">
                <h2>Pressure Loss Breakdown</h2>

                <ResponsiveContainer width="100%" height={330}>
                  <BarChart data={result.breakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="item" />
                    <YAxis />
                    <Tooltip />
                    <Bar
                      dataKey="pressure"
                      fill="#e00000"
                      name="Pressure Loss Pa"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              <section className="tablePanel">
                <h2>Section-by-Section Pressure Calculation</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Section</th>
                      <th>Pressure Loss Pa</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.breakdown.map((item, index) => (
                      <tr key={index}>
                        <td>{item.item}</td>
                        <td>{item.pressure.toFixed(2)}</td>
                      </tr>
                    ))}

                    <tr>
                      <td><b>Total Static Pressure</b></td>
                      <td><b>{result.totalStaticPressure.toFixed(2)} Pa</b></td>
                    </tr>

                    <tr>
                      <td><b>Recommended Fan Pressure</b></td>
                      <td><b>{result.recommendedFanPressure} Pa</b></td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="tablePanel">
                <h2>Fan Power Result</h2>

                <table>
                  <tbody>
                    <tr>
                      <td>Airflow</td>
                      <td>{fanResult.airflowCMH} CMH</td>
                    </tr>

                    <tr>
                      <td>Total Pressure</td>
                      <td>{fanResult.totalPressurePa} Pa</td>
                    </tr>

                    <tr>
                      <td>Fan Efficiency</td>
                      <td>{fanResult.fanEfficiency}%</td>
                    </tr>

                    <tr>
                      <td>Fan Power</td>
                      <td>{fanResult.fanKW.toFixed(2)} kW</td>
                    </tr>

                    <tr>
                      <td>Calculated HP</td>
                      <td>{fanResult.calculatedHP.toFixed(2)} HP</td>
                    </tr>

                    <tr>
                      <td>Selected Motor</td>
                      <td>{fanResult.selectedMotorHP} HP</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Pressure Loss Warnings</h2>

                  {result.warnings.map((warning, index) => (
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

export default PressureLossDashboard;