function AHUCalculator({ data, update, setResult }) {
  function calculateAHU() {
    const airflow = Number(data.ahuAirflow || 0);
    const faceVelocity = Number(data.faceVelocity || 0);
    const width = Number(data.ahuWidth || 0);
    const staticPressure = Number(data.staticPressure || 0);
    const fanEfficiency = Number(data.fanEfficiency || 0);

    const faceArea = airflow / (3600 * faceVelocity);
    const ahuHeight = (faceArea / (width / 1000)) * 1000;

    const fanKW =
      ((airflow / 3600) * staticPressure) /
      (1000 * (fanEfficiency / 100));

    const fanHP = fanKW / 0.746;

    setResult(
      `Face Area = ${faceArea.toFixed(2)} m² | AHU Size = ${width.toFixed(
        0
      )} mm W × ${ahuHeight.toFixed(0)} mm H | Fan Power = ${fanKW.toFixed(
        2
      )} kW | Motor = ${fanHP.toFixed(2)} HP`
    );
  }

  return (
    <>
      <input
        type="number"
        placeholder="Supply Airflow CMH"
        value={data.ahuAirflow || ""}
        onChange={(e) => update("ahuAirflow", e.target.value)}
      />

      <input
        type="number"
        placeholder="Face Velocity m/s"
        value={data.faceVelocity || ""}
        onChange={(e) => update("faceVelocity", e.target.value)}
      />

      <input
        type="number"
        placeholder="AHU Width mm"
        value={data.ahuWidth || ""}
        onChange={(e) => update("ahuWidth", e.target.value)}
      />

      <input
        type="number"
        placeholder="Total Static Pressure Pa"
        value={data.staticPressure || ""}
        onChange={(e) => update("staticPressure", e.target.value)}
      />

      <input
        type="number"
        placeholder="Fan Efficiency %"
        value={data.fanEfficiency || ""}
        onChange={(e) => update("fanEfficiency", e.target.value)}
      />

      <button onClick={calculateAHU}>Calculate AHU</button>
    </>
  );
}

export default AHUCalculator;