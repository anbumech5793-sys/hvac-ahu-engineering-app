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
  selectFilterSet,
  getFilterCatalog,
} from "./filterCatalogEngine";

function FilterCatalogDashboard() {
  const [input, setInput] = useState({
    airflowCMH: 2250,
    application: "Pharma Cleanroom",
    cleanroomClass: "ISO 8",
    dustLevel: "medium",
  });

  const [result, setResult] = useState(null);

  function update(key, value) {
    setInput({
      ...input,
      [key]: value,
    });
  }

  function calculateFilter() {
    const filterResult = selectFilterSet({
      airflowCMH: Number(input.airflowCMH),
      application: input.application,
      cleanroomClass: input.cleanroomClass,
      dustLevel: input.dustLevel,
    });

    setResult(filterResult);
  }

  const catalog = getFilterCatalog();

  const pressureChart =
    result?.selectedFilters.map((filter) => ({
      grade: filter.grade,
      initial: filter.totalInitialPressurePa,
      final: filter.totalFinalPressurePa,
    })) || [];

  return (
    <div className="filterApp">
      <header className="filterHeader">
        <div>
          <h1>Filter Catalog Selection Engine</h1>
          <p>
            G4 • F7/F8 • H13/H14 selection with quantity, face velocity,
            pressure drop and replacement interval
          </p>
        </div>

        <button onClick={calculateFilter}>
          Select Filter Set
        </button>
      </header>

      <div className="filterGrid">
        <aside className="filterInputPanel">
          <h2>Filter Inputs</h2>

          <label>Airflow CMH</label>
          <input
            type="number"
            value={input.airflowCMH}
            onChange={(e) => update("airflowCMH", e.target.value)}
          />

          <label>Application</label>
          <select
            value={input.application}
            onChange={(e) => update("application", e.target.value)}
          >
            <option>Pharma Cleanroom</option>
            <option>Pharma Machine AHU</option>
            <option>Office HVAC</option>
            <option>Commercial Room</option>
            <option>Warehouse</option>
            <option>Hospital HVAC</option>
          </select>

          <label>Cleanroom Class</label>
          <select
            value={input.cleanroomClass}
            onChange={(e) => update("cleanroomClass", e.target.value)}
          >
            <option>ISO 5</option>
            <option>ISO 6</option>
            <option>ISO 7</option>
            <option>ISO 8</option>
            <option>Controlled / Non-classified</option>
            <option>Comfort HVAC</option>
          </select>

          <label>Dust Level</label>
          <select
            value={input.dustLevel}
            onChange={(e) => update("dustLevel", e.target.value)}
          >
            <option>low</option>
            <option>medium</option>
            <option>high</option>
          </select>

          <div className="filterNote">
            <strong>Selection Logic</strong>
            <p>
              Software selects filter train based on application, cleanroom
              class and airflow. Final filter selection must be verified with
              manufacturer data sheets.
            </p>
          </div>
        </aside>

        <main className="filterOutputPanel">
          {!result && (
            <section className="emptyState">
              <h2>Ready for Filter Selection</h2>
              <p>
                Enter airflow, application and cleanroom class, then click
                Select Filter Set.
              </p>
            </section>
          )}

          {result && (
            <>
              <section className="kpiGrid">
                <div>
                  <span>Filter Stages</span>
                  <strong>{result.selectedFilters.length}</strong>
                </div>

                <div>
                  <span>Initial Pressure</span>
                  <strong>{result.totalInitialPressurePa} Pa</strong>
                </div>

                <div>
                  <span>Final Pressure</span>
                  <strong>{result.totalFinalPressurePa} Pa</strong>
                </div>

                <div>
                  <span>Total Cost</span>
                  <strong>₹{result.totalCost}</strong>
                </div>
              </section>

              <section className="tablePanel">
                <h2>Selected Filter Train</h2>

                <table>
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Grade</th>
                      <th>Size</th>
                      <th>Qty</th>
                      <th>Rated Airflow</th>
                      <th>Face Velocity</th>
                      <th>Initial PD</th>
                      <th>Final PD</th>
                      <th>Replacement</th>
                      <th>Cost</th>
                    </tr>
                  </thead>

                  <tbody>
                    {result.selectedFilters.map((filter) => (
                      <tr key={filter.id}>
                        <td>{filter.type}</td>
                        <td>{filter.grade}</td>
                        <td>{filter.size}</td>
                        <td>{filter.quantity}</td>
                        <td>{filter.totalRatedAirflowCMH} CMH</td>
                        <td>{filter.faceVelocityMS} m/s</td>
                        <td>{filter.totalInitialPressurePa} Pa</td>
                        <td>{filter.totalFinalPressurePa} Pa</td>
                        <td>{filter.replacementInterval}</td>
                        <td>₹{filter.totalCost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <section className="chartCard">
                <h2>Filter Pressure Drop</h2>

                <ResponsiveContainer width="100%" height={320}>
                  <BarChart data={pressureChart}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="grade" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="initial" fill="#0066ff" name="Initial Pa" />
                    <Bar dataKey="final" fill="#e00000" name="Final Pa" />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              {result.warnings.length > 0 && (
                <section className="warningPanel">
                  <h2>Filter Selection Warnings</h2>

                  {result.warnings.map((warning, index) => (
                    <p key={index}>⚠ {warning}</p>
                  ))}
                </section>
              )}
            </>
          )}

          <section className="tablePanel">
            <h2>Filter Catalog Table</h2>

            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Type</th>
                  <th>Grade</th>
                  <th>Size</th>
                  <th>Rated Airflow</th>
                  <th>Initial PD</th>
                  <th>Final PD</th>
                  <th>Application</th>
                  <th>Cost</th>
                </tr>
              </thead>

              <tbody>
                {catalog.map((filter) => (
                  <tr key={filter.id}>
                    <td>{filter.id}</td>
                    <td>{filter.type}</td>
                    <td>{filter.grade}</td>
                    <td>{filter.size}</td>
                    <td>{filter.ratedAirflowCMH} CMH</td>
                    <td>{filter.initialPressurePa} Pa</td>
                    <td>{filter.finalPressurePa} Pa</td>
                    <td>{filter.application}</td>
                    <td>₹{filter.cost}</td>
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

export default FilterCatalogDashboard;