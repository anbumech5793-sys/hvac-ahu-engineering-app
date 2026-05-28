import { useState } from "react";

function CoilEngine() {
  const [airflow, setAirflow] = useState("");
  const [enterTemp, setEnterTemp] = useState("");
  const [leaveTemp, setLeaveTemp] = useState("");
  const [faceVelocity, setFaceVelocity] = useState("");
  const [result, setResult] = useState(null);

  function calculateCoil() {
    const q = Number(airflow || 0);
    const tin = Number(enterTemp || 0);
    const tout = Number(leaveTemp || 0);
    const fv = Number(faceVelocity || 0);

    const deltaT = tin - tout;
    const kw = q * deltaT * 0.000335;
    const tr = kw / 3.517;
    const waterFlowLPM = tr * 2.4;
    const faceArea = q / (3600 * fv);

    let rows = 4;
    if (deltaT > 10) rows = 6;
    if (deltaT > 16) rows = 8;

    setResult({
      deltaT,
      kw,
      tr,
      waterFlowLPM,
      faceArea,
      rows,
    });
  }

  return (
    <div className="coilPanel">
      <h3>Cooling Coil Selection Engine</h3>

      <input
        type="number"
        placeholder="Airflow CMH"
        value={airflow}
        onChange={(e) => setAirflow(e.target.value)}
      />

      <input
        type="number"
        placeholder="Entering Air Temp °C"
        value={enterTemp}
        onChange={(e) => setEnterTemp(e.target.value)}
      />

      <input
        type="number"
        placeholder="Leaving Air Temp °C"
        value={leaveTemp}
        onChange={(e) => setLeaveTemp(e.target.value)}
      />

      <input
        type="number"
        placeholder="Face Velocity m/s"
        value={faceVelocity}
        onChange={(e) => setFaceVelocity(e.target.value)}
      />

      <button onClick={calculateCoil}>Calculate Coil</button>

      {result && (
        <div className="coilResult">
          <p>ΔT: {result.deltaT.toFixed(2)} °C</p>
          <p>Cooling Load: {result.kw.toFixed(2)} kW</p>
          <p>Cooling Load: {result.tr.toFixed(2)} TR</p>
          <p>Chilled Water Flow: {result.waterFlowLPM.toFixed(2)} LPM</p>
          <p>Coil Face Area: {result.faceArea.toFixed(2)} m²</p>
          <p>Suggested Coil Rows: {result.rows} Row</p>
        </div>
      )}
    </div>
  );
}

export default CoilEngine;