import { useState } from "react";
import {
  generateProfessionalDesignBasis,
  getApplicationOptions,
  getCleanroomClassOptions,
} from "./professionalDesignBasisEngine";

function ProfessionalProjectInputDashboard() {
  const [input, setInput] = useState({
    projectName: "Demo Pharma Cleanroom Project",
    clientName: "ABC Pharma",
    application: "pharma_cleanroom",
    cleanroomClass: "ISO 8",
    length: 6,
    width: 5,
    height: 3,
    ach: 25,
    temperature: 22,
    rh: 50,
    pressure: 15,
    freshAirPercent: 20,
    exhaustPercent: 10,
  });

  const [result, setResult] = useState(null);

  const applications = getApplicationOptions();
  const cleanroomClasses = getCleanroomClassOptions();

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function generateBasis() {
    const designBasis = generateProfessionalDesignBasis(input);
    setResult(designBasis);
  }

  return (
    <div className="professionalInputApp">
      <header className="professionalInputHeader">
        <div>
          <h1>Professional Project Input</h1>
          <p>
            Application + room size → professional design basis, airflow,
            pressure and standards
          </p>
        </div>

        <button onClick={generateBasis}>Generate Design Basis</button>
      </header>

      <div className="professionalInputGrid">
        <aside className="professionalInputPanel">
          <h2>Project Data</h2>

          <label>Project Name</label>
          <input
            value={input.projectName}
            onChange={(e) => update("projectName", e.target.value)}
          />

          <label>Client Name</label>
          <input
            value={input.clientName}
            onChange={(e) => update("clientName", e.target.value)}
          />

          <label>Application</label>
          <select
            value={input.application}
            onChange={(e) => update("application", e.target.value)}
          >
            {applications.map((app) => (
              <option key={app.key} value={app.key}>
                {app.label}
              </option>
            ))}
          </select>

          <label>Cleanroom / HVAC Class</label>
          <select
            value={input.cleanroomClass}
            onChange={(e) => update("cleanroomClass", e.target.value)}
          >
            {cleanroomClasses.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>

          <h3>Room Size</h3>

          <label>Length m</label>
          <input
            type="number"
            value={input.length}
            onChange={(e) => update("length", e.target.value)}
          />

          <label>Width m</label>
          <input
            type="number"
            value={input.width}
            onChange={(e) => update("width", e.target.value)}
          />

          <label>Height m</label>
          <input
            type="number"
            value={input.height}
            onChange={(e) => update("height", e.target.value)}
          />

          <h3>Advanced Override</h3>

          <label>ACH</label>
          <input
            type="number"
            value={input.ach}
            onChange={(e) => update("ach", e.target.value)}
          />

          <label>Temperature °C</label>
          <input
            type="number"
            value={input.temperature}
            onChange={(e) => update("temperature", e.target.value)}
          />

          <label>RH %</label>
          <input
            type="number"
            value={input.rh}
            onChange={(e) => update("rh", e.target.value)}
          />

          <label>Room Pressure Pa</label>
          <input
            type="number"
            value={input.pressure}
            onChange={(e) => update("pressure", e.target.value)}
          />

          <label>Fresh Air %</label>
          <input
            type="number"
            value={input.freshAirPercent}
            onChange={(e) => update("freshAirPercent", e.target.value)}
          />

          <label>Exhaust %</label>
          <input
            type="number"
            value={input.exhaustPercent}
            onChange={(e) => update("exhaustPercent", e.target.value)}
          />
        </aside>

        <main className="professionalOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Professional Design Basis</h2>
              <p>
                Enter project details and click Generate Design Basis.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Application</span>
                  <strong>{result.application.label}</strong>
                </div>

                <div>
                  <span>Class</span>
                  <strong>{result.designBasis.cleanroomClass}</strong>
                </div>

                <div>
                  <span>Room Volume</span>
                  <strong>{result.room.volumeM3.toFixed(2)} m³</strong>
                </div>

                <div>
                  <span>ACH</span>
                  <strong>{result.designBasis.ach}</strong>
                </div>

                <div>
                  <span>Supply Air</span>
                  <strong>{result.airflow.supplyAirflowCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Fresh Air</span>
                  <strong>{result.airflow.freshAirCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Return Air</span>
                  <strong>{result.airflow.returnAirCMH.toFixed(0)} CMH</strong>
                </div>

                <div>
                  <span>Pressure</span>
                  <strong>+{result.designBasis.pressurePa} Pa</strong>
                </div>
              </section>

              <section className="standardPanel">
                <h2>Professional Design Basis</h2>

                <p>
                  <b>Industry:</b> {result.application.industry}
                </p>

                <p>
                  <b>Temperature / RH:</b>{" "}
                  {result.designBasis.temperatureC}°C /{" "}
                  {result.designBasis.rhPercent}%
                </p>

                <p>
                  <b>ACH Range:</b>{" "}
                  {result.designBasis.achRange[0]} -{" "}
                  {result.designBasis.achRange[1]}
                </p>

                <p>
                  <b>Fresh Air:</b> {result.designBasis.freshAirPercent}%
                </p>

                <p>
                  <b>Exhaust:</b> {result.designBasis.exhaustPercent}%
                </p>

                <p>
                  <b>Filter Train:</b>{" "}
                  {Array.isArray(result.designBasis.filterTrain)
                    ? result.designBasis.filterTrain.join(" + ")
                    : result.designBasis.filterTrain}
                </p>
              </section>

              <section className="tablePanel">
                <h2>Room Calculation</h2>

                <table>
                  <tbody>
                    <tr>
                      <td>Length</td>
                      <td>{result.room.length} m</td>
                    </tr>

                    <tr>
                      <td>Width</td>
                      <td>{result.room.width} m</td>
                    </tr>

                    <tr>
                      <td>Height</td>
                      <td>{result.room.height} m</td>
                    </tr>

                    <tr>
                      <td>Area</td>
                      <td>{result.room.areaM2.toFixed(2)} m²</td>
                    </tr>

                    <tr>
                      <td>Volume</td>
                      <td>{result.room.volumeM3.toFixed(2)} m³</td>
                    </tr>

                    <tr>
                      <td>Supply Airflow</td>
                      <td>{result.airflow.supplyAirflowCMH.toFixed(0)} CMH</td>
                    </tr>

                    <tr>
                      <td>Fresh Airflow</td>
                      <td>{result.airflow.freshAirCMH.toFixed(0)} CMH</td>
                    </tr>

                    <tr>
                      <td>Return Airflow</td>
                      <td>{result.airflow.returnAirCMH.toFixed(0)} CMH</td>
                    </tr>

                    <tr>
                      <td>Exhaust Airflow</td>
                      <td>{result.airflow.exhaustCMH.toFixed(0)} CMH</td>
                    </tr>
                  </tbody>
                </table>
              </section>

              <section className="tablePanel">
                <h2>Standards Reference</h2>

                <table>
                  <tbody>
                    {result.designBasis.standards.map((standard, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{standard}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="tablePanel">
                <h2>Engineering Notes</h2>

                <table>
                  <tbody>
                    {result.designBasis.notes.map((note, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Warnings</h2>

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

export default ProfessionalProjectInputDashboard;